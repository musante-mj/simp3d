/**
  * @author Kai Salmen / https://kaisalmen.de
  * Development repository: https://github.com/kaisalmen/WWOBJLoader
  */

'use strict';

if ( THREE.OBJLoader2 === undefined ) { THREE.OBJLoader2 = {} }

if ( THREE.LoaderSupport === undefined ) console.error( '"THREE.LoaderSupport" is not available. "THREE.OBJLoader2" requires it. Please include "LoaderSupport.js" in your HTML.' );

/**
 * Use this class to load OBJ data from files or to parse OBJ data from an arraybuffer
 * @class
 *
 * @param {THREE.DefaultLoadingManager} [manager] The loadingManager for the loader to use. Default is {@link THREE.DefaultLoadingManager}
 */

THREE.OBJLoader2 = function ( manager ) {
	console.info( 'Using THREE.OBJLoader2 version: ' + THREE.OBJLoader2.OBJLOADER2_VERSION );

	this.manager = THREE.LoaderSupport.Validator.verifyInput( manager, THREE.DefaultLoadingManager );
	this.logging = {
		enabled: true,
		debug: false
	};

	this.modelName = '';
	this.instanceNo = 0;
	this.path;
	this.resourcePath;
	this.useIndices = false;
	this.disregardNormals = false;
	this.materialPerSmoothingGroup = false;
	this.useOAsMesh = false;
	this.loaderRootNode = new THREE.Group();

	this.meshBuilder = new THREE.LoaderSupport.MeshBuilder();
	this.callbacks = new THREE.LoaderSupport.Callbacks();
	this.workerSupport = new THREE.LoaderSupport.WorkerSupport();
	this.terminateWorkerOnLoad = true;
};

THREE.OBJLoader2.OBJLOADER2_VERSION = '2.5.0';

THREE.OBJLoader2.prototype = {

	constructor: THREE.OBJLoader2,

	/**
	 * Enable or disable logging in general (except warn and error), plus enable or disable debug logging.
	 *
	 * @param {boolean} enabled True or false.
	 * @param {boolean} debug True or false.
	 */
	setLogging: function ( enabled, debug ) {
		this.logging.enabled = enabled === true;
		this.logging.debug = debug === true;
		this.meshBuilder.setLogging( this.logging.enabled, this.logging.debug );
	},

	/**
	 * Set the name of the model.
	 *
	 * @param {string} modelName
	 */
	setModelName: function ( modelName ) {
		this.modelName = THREE.LoaderSupport.Validator.verifyInput( modelName, this.modelName );
	},

	/**
	 * The URL of the base path.
	 *
	 * @param {string} path URL
	 */
	setPath: function ( path ) {
		this.path = THREE.LoaderSupport.Validator.verifyInput( path, this.path );
	},

	/**
	 * Allows to specify resourcePath for dependencies of specified resource.
	 * @param {string} resourcePath
	 */
	setResourcePath: function ( resourcePath ) {
		this.resourcePath = THREE.LoaderSupport.Validator.verifyInput( resourcePath, this.resourcePath );
	},

	/**
	 * Set the node where the loaded objects will be attached directly.
	 *
	 * @param {THREE.Object3D} streamMeshesTo Object already attached to scenegraph where new meshes will be attached to
	 */
	setStreamMeshesTo: function ( streamMeshesTo ) {
		this.loaderRootNode = THREE.LoaderSupport.Validator.verifyInput( streamMeshesTo, this.loaderRootNode );
	},

	/**
	 * Set materials loaded by MTLLoader or any other supplier of an Array of {@link THREE.Material}.
	 *
	 * @param {THREE.Material[]} materials Array of {@link THREE.Material}
	 */
	setMaterials: function ( materials ) {
		this.meshBuilder.setMaterials( materials );
	},

	/**
	 * Instructs loaders to create indexed {@link THREE.BufferGeometry}.
	 *
	 * @param {boolean} useIndices=false
	 */
	setUseIndices: function ( useIndices ) {
		this.useIndices = useIndices === true;
	},

	/**
	 * Tells whether normals should be completely disregarded and regenerated.
	 *
	 * @param {boolean} disregardNormals=false
	 */
	setDisregardNormals: function ( disregardNormals ) {
		this.disregardNormals = disregardNormals === true;
	},

	/**
	 * Tells whether a material shall be created per smoothing group.
	 *
	 * @param {boolean} materialPerSmoothingGroup=false
	 */
	setMaterialPerSmoothingGroup: function ( materialPerSmoothingGroup ) {
		this.materialPerSmoothingGroup = materialPerSmoothingGroup === true;
	},

	/**
	 * Usually 'o' is meta-information and does not result in creation of new meshes, but mesh creation on occurrence of "o" can be enforced.
	 *
	 * @param {boolean} useOAsMesh=false
	 */
	setUseOAsMesh: function ( useOAsMesh ) {
		this.useOAsMesh = useOAsMesh === true;
	},

	_setCallbacks: function ( callbacks ) {
		if ( THREE.LoaderSupport.Validator.isValid( callbacks.onProgress ) ) this.callbacks.setCallbackOnProgress( callbacks.onProgress );
		if ( THREE.LoaderSupport.Validator.isValid( callbacks.onReportError ) ) this.callbacks.setCallbackOnReportError( callbacks.onReportError );
		if ( THREE.LoaderSupport.Validator.isValid( callbacks.onMeshAlter ) ) this.callbacks.setCallbackOnMeshAlter( callbacks.onMeshAlter );
		if ( THREE.LoaderSupport.Validator.isValid( callbacks.onLoad ) ) this.callbacks.setCallbackOnLoad( callbacks.onLoad );
		if ( THREE.LoaderSupport.Validator.isValid( callbacks.onLoadMaterials ) ) this.callbacks.setCallbackOnLoadMaterials( callbacks.onLoadMaterials );

		this.meshBuilder._setCallbacks( this.callbacks );
	},

	/**
	 * Announce feedback which is give to the registered callbacks.
	 * @private
	 *
	 * @param {string} type The type of event
	 * @param {string} text Textual description of the event
	 * @param {number} numericalValue Numerical value describing the progress
	 */
	onProgress: function ( type, text, numericalValue ) {
		var content = THREE.LoaderSupport.Validator.isValid( text ) ? text: '';
		var event = {
			detail: {
				type: type,
				modelName: this.modelName,
				instanceNo: this.instanceNo,
				text: content,
				numericalValue: numericalValue
			}
		};

		if ( THREE.LoaderSupport.Validator.isValid( this.callbacks.onProgress ) ) this.callbacks.onProgress( event );

		if ( this.logging.enabled && this.logging.debug ) console.debug( content );
	},

	_onError: function ( event ) {
		var output = 'Error occurred while downloading!';

		if ( event.currentTarget && event.currentTarget.statusText !== null ) {

			output += '\nurl: ' + event.currentTarget.responseURL + '\nstatus: ' + event.currentTarget.statusText;

		}
		this.onProgress( 'error', output, -1 );
		this._throwError( output );
	},

	_throwError: function ( errorMessage ) {
		if ( THREE.LoaderSupport.Validator.isValid( this.callbacks.onReportError ) )  {

			this.callbacks.onReportError( errorMessage );

		} else {

			throw errorMessage;

		}
	},

	/**
	 * Use this convenient method to load a file at the given URL. By default the fileLoader uses an ArrayBuffer.
	 *
	 * @param {string} url A string containing the path/URL of the file to be loaded.
	 * @param {callback} onLoad A function to be called after loading is successfully completed. The function receives loaded Object3D as an argument.
	 * @param {callback} [onProgress] A function to be called while the loading is in progress. The argument will be the XMLHttpRequest instance, which contains total and Integer bytes.
	 * @param {callback} [onError] A function to be called if an error occurs during loading. The function receives the error as an argument.
	 * @param {callback} [onMeshAlter] A function to be called after a new mesh raw data becomes available for alteration.
	 * @param {boolean} [useAsync] If true, uses async loading with worker, if false loads data synchronously.
	 */
	load: function ( url, onLoad, onProgress, onError, onMeshAlter, useAsync ) {
		var resource = new THREE.LoaderSupport.ResourceDescriptor( url, 'OBJ' );
		this._loadObj( resource, onLoad, onProgress, onError, onMeshAlter, useAsync );
	},

	_loadObj: function ( resource, onLoad, onProgress, onError, onMeshAlter, useAsync ) {
		var scope = this;
		if ( ! THREE.LoaderSupport.Validator.isValid( onError ) ) {
			onError = function ( event ) {
				scope._onError( event );
			}
		}

		// fast-fail
		if ( ! THREE.LoaderSupport.Validator.isValid( resource ) ) onError( 'An invalid ResourceDescriptor was provided. Unable to continue!' );
		var fileLoaderOnLoad = function ( content ) {

			resource.content = content;
			if ( useAsync ) {

				scope.parseAsync( content, onLoad );

			} else {

				var callbacks = new THREE.LoaderSupport.Callbacks();
				callbacks.setCallbackOnMeshAlter( onMeshAlter );
				scope._setCallbacks( callbacks );
				onLoad(
					{
						detail: {
							loaderRootNode: scope.parse( content ),
							modelName: scope.modelName,
							instanceNo: scope.instanceNo
						}
					}
				);

			}
		};
		this.setPath( resource.path );
		this.setResourcePath( resource.resourcePath );

		// fast-fail
		if ( ! THREE.LoaderSupport.Validator.isValid( resource.url ) || THREE.LoaderSupport.Validator.isValid( resource.content ) ) {

			fileLoaderOnLoad( THREE.LoaderSupport.Validator.isValid( resource.content ) ? resource.content : null );

		} else {

			if ( ! THREE.LoaderSupport.Validator.isValid( onProgress ) ) {
				var numericalValueRef = 0;
				var numericalValue = 0;
				onProgress = function ( event ) {
					if ( ! event.lengthComputable ) return;

					numericalValue = event.loaded / event.total;
					if ( numericalValue > numericalValueRef ) {

						numericalValueRef = numericalValue;
						var output = 'Download of "' + resource.url + '": ' + ( numericalValue * 100 ).toFixed( 2 ) + '%';
						scope.onProgress( 'progressLoad', output, numericalValue );

					}
				};
			}


			var fileLoader = new THREE.FileLoader( this.manager );
			fileLoader.setPath( this.path || this.resourcePath );
			fileLoader.setResponseType( 'arraybuffer' );
			fileLoader.load( resource.name, fileLoaderOnLoad, onProgress, onError );

		}
	},

	/**
	 * Run the loader according the provided instructions.
	 *
	 * @param {THREE.LoaderSupport.PrepData} prepData All parameters and resources required for execution
	 * @param {THREE.LoaderSupport.WorkerSupport} [workerSupportExternal] Use pre-existing WorkerSupport
	 */
	run: function ( prepData, workerSupportExternal ) {
		this._applyPrepData( prepData );
		var available = prepData.checkResourceDescriptorFiles( prepData.resources,
			[
				{ ext: "obj", type: "ArrayBuffer", ignore: false },
				{ ext: "mtl", type: "String", ignore: false },
				{ ext: "zip", type: "String", ignore: true }
			]
		);
		if ( THREE.LoaderSupport.Validator.isValid( workerSupportExternal ) ) {

			this.terminateWorkerOnLoad = false;
			this.workerSupport = workerSupportExternal;
			this.logging.enabled = this.workerSupport.logging.enabled;
			this.logging.debug = this.workerSupport.logging.debug;

		}
		var scope = this;
		var onMaterialsLoaded = function ( materials ) {
			if ( materials !== null ) scope.meshBuilder.setMaterials( materials );
			scope._loadObj( available.obj, scope.callbacks.onLoad, null, null, scope.callbacks.onMeshAlter, prepData.useAsync );

		};
		this._loadMtl( available.mtl, onMaterialsLoaded, null, null, prepData.crossOrigin, prepData.materialOptions );
	},

	_applyPrepData: function ( prepData ) {
		if ( THREE.LoaderSupport.Validator.isValid( prepData ) ) {

			this.setLogging( prepData.logging.enabled, prepData.logging.debug );
			this.setModelName( prepData.modelName );
			this.setStreamMeshesTo( prepData.streamMeshesTo );
			this.meshBuilder.setMaterials( prepData.materials );
			this.setUseIndices( prepData.useIndices );
			this.setDisregardNormals( prepData.disregardNormals );
			this.setMaterialPerSmoothingGroup( prepData.materialPerSmoothingGroup );
			this.setUseOAsMesh( prepData.useOAsMesh );

			this._setCallbacks( prepData.getCallbacks() );

		}
	},

	/**
	 * Parses OBJ data synchronously from arraybuffer or string.
	 *
	 * @param {arraybuffer|string} content OBJ data as Uint8Array or String
	 */
	parse: function ( content ) {
		// fast-fail in case of illegal data
		if ( ! THREE.LoaderSupport.Validator.isValid( content ) ) {

			console.warn( 'Provided content is not a valid ArrayBuffer or String.' );
			return this.loaderRootNode;

		}
		if ( this.logging.enabled ) console.time( 'OBJLoader2 parse: ' + this.modelName );
		this.meshBuilder.init();

		var parser = new THREE.OBJLoader2.Parser();
		parser.setLogging( this.logging.enabled, this.logging.debug );
		parser.setMaterialPerSmoothingGroup( this.materialPerSmoothingGroup );
		parser.setUseOAsMesh( this.useOAsMesh );
		parser.setUseIndices( this.useIndices );
		parser.setDisregardNormals( this.disregardNormals );
		// sync code works directly on the material references
		parser.setMaterials( this.meshBuilder.getMaterials() );

		var scope = this;
		var onMeshLoaded = function ( payload ) {
			var meshes = scope.meshBuilder.processPayload( payload );
			var mesh;
			for ( var i in meshes ) {
				mesh = meshes[ i ];
				scope.loaderRootNode.add( mesh );
			}
		};
		parser.setCallbackMeshBuilder( onMeshLoaded );
		var onProgressScoped = function ( text, numericalValue ) {
			scope.onProgress( 'progressParse', text, numericalValue );
		};
		parser.setCallbackProgress( onProgressScoped );

		if ( content instanceof ArrayBuffer || content instanceof Uint8Array ) {

			if ( this.logging.enabled ) console.info( 'Parsing arrayBuffer...' );
			parser.parse( content );

		} else if ( typeof( content ) === 'string' || content instanceof String ) {

			if ( this.logging.enabled ) console.info( 'Parsing text...' );
			parser.parseText( content );

		} else {

			this._throwError( 'Provided content was neither of type String nor Uint8Array! Aborting...' );

		}
		if ( this.logging.enabled ) console.timeEnd( 'OBJLoader2 parse: ' + this.modelName );

		return this.loaderRootNode;
	},

	/**
	 * Parses OBJ content asynchronously from arraybuffer.
	 *
	 * @param {arraybuffer} content OBJ data as Uint8Array
	 * @param {callback} onLoad Called after worker successfully completed loading
	 */
	parseAsync: function ( content, onLoad ) {
		var scope = this;
		var measureTime = false;
		var scopedOnLoad = function () {
			onLoad(
				{
					detail: {
						loaderRootNode: scope.loaderRootNode,
						modelName: scope.modelName,
						instanceNo: scope.instanceNo
					}
				}
			);
			if ( measureTime && scope.logging.enabled ) console.timeEnd( 'OBJLoader2 parseAsync: ' + scope.modelName );
		};
		// fast-fail in case of illegal data
		if ( ! THREE.LoaderSupport.Validator.isValid( content ) ) {

			console.warn( 'Provided content is not a valid ArrayBuffer.' );
			scopedOnLoad()

		} else {

			measureTime = true;

		}
		if ( measureTime && this.logging.enabled ) console.time( 'OBJLoader2 parseAsync: ' + this.modelName );
		this.meshBuilder.init();

		var scopedOnMeshLoaded = function ( payload ) {
			var meshes = scope.meshBuilder.processPayload( payload );
			var mesh;
			for ( var i in meshes ) {
				mesh = meshes[ i ];
				scope.loaderRootNode.add( mesh );
			}
		};
		var buildCode = function ( codeSerializer ) {
			var workerCode = '';
			workerCode += '/**\n';
			workerCode += '  * This code was constructed by OBJLoader2 buildCode.\n';
			workerCode += '  */\n\n';
			workerCode += 'THREE = { LoaderSupport: {}, OBJLoader2: {} };\n\n';
			workerCode += codeSerializer.serializeObject( 'THREE.LoaderSupport.Validator', THREE.LoaderSupport.Validator );
			workerCode += codeSerializer.serializeClass( 'THREE.OBJLoader2.Parser', THREE.OBJLoader2.Parser );

			return workerCode;
		};
		this.workerSupport.validate( buildCode, 'THREE.OBJLoader2.Parser' );
		this.workerSupport.setCallbacks( scopedOnMeshLoaded, scopedOnLoad );
		if ( scope.terminateWorkerOnLoad ) this.workerSupport.setTerminateRequested( true );

		var materialNames = {};
		var materials = this.meshBuilder.getMaterials();
		for ( var materialName in materials ) {

			materialNames[ materialName ] = materialName;

		}
		this.workerSupport.run(
			{
				params: {
					useAsync: true,
					materialPerSmoothingGroup: this.materialPerSmoothingGroup,
					useOAsMesh: this.useOAsMesh,
					useIndices: this.useIndices,
					disregardNormals: this.disregardNormals
				},
				logging: {
					enabled: this.logging.enabled,
					debug: this.logging.debug
				},
				materials: {
					// in async case only material names are supplied to parser
					materials: materialNames
				},
				data: {
					input: content,
					options: null
				}
			}
		);
	},

	/**
	 * Utility method for loading an mtl file according resource description. Provide url or content.
	 *
	 * @param {string} url URL to the file
	 * @param {Object} content The file content as arraybuffer or text
	 * @param {function} onLoad Callback to be called after successful load
	 * @param {callback} [onProgress] A function to be called while the loading is in progress. The argument will be the XMLHttpRequest instance, which contains total and Integer bytes.
	 * @param {callback} [onError] A function to be called if an error occurs during loading. The function receives the error as an argument.
	 * @param {string} [crossOrigin] CORS value
 	 * @param {Object} [materialOptions] Set material loading options for MTLLoader
	 */
	loadMtl: function ( url, content, onLoad, onProgress, onError, crossOrigin, materialOptions ) {
		var resource = new THREE.LoaderSupport.ResourceDescriptor( url, 'MTL' );
		resource.setContent( content );
		this._loadMtl( resource, onLoad, onProgress, onError, crossOrigin, materialOptions );
	},

	_loadMtl: function ( resource, onLoad, onProgress, onError, crossOrigin, materialOptions ) {
		if ( THREE.MTLLoader === undefined ) console.error( '"THREE.MTLLoader" is not available. "THREE.OBJLoader2" requires it for loading MTL files.' );
		if ( THREE.LoaderSupport.Validator.isValid( resource ) && this.logging.enabled ) console.time( 'Loading MTL: ' + resource.name );

		var materials = [];
		var scope = this;
		var processMaterials = function ( materialCreator ) {
			var materialCreatorMaterials = [];
			if ( THREE.LoaderSupport.Validator.isValid( materialCreator ) ) {

				materialCreator.preload();
				materialCreatorMaterials = materialCreator.materials;
				for ( var materialName in materialCreatorMaterials ) {

					if ( materialCreatorMaterials.hasOwnProperty( materialName ) ) {

						materials[ materialName ] = materialCreatorMaterials[ materialName ];

					}
				}
			}

			if ( THREE.LoaderSupport.Validator.isValid( resource ) && scope.logging.enabled ) console.timeEnd( 'Loading MTL: ' + resource.name );
			onLoad( materials, materialCreator );
		};

		// fast-fail
		if ( ! THREE.LoaderSupport.Validator.isValid( resource ) || ( ! THREE.LoaderSupport.Validator.isValid( resource.content ) && ! THREE.LoaderSupport.Validator.isValid( resource.url ) ) ) {

			processMaterials();

		} else {

			var mtlLoader = new THREE.MTLLoader( this.manager );
			crossOrigin = THREE.LoaderSupport.Validator.verifyInput( crossOrigin, 'anonymous' );
			mtlLoader.setCrossOrigin( crossOrigin );
			mtlLoader.setResourcePath( resource.resourcePath || resource.path );
			if ( THREE.LoaderSupport.Validator.isValid( materialOptions ) ) mtlLoader.setMaterialOptions( materialOptions );

			var parseTextWithMtlLoader = function ( content ) {
				var contentAsText = content;
				if ( typeof( content ) !== 'string' && ! ( content instanceof String ) ) {

					if ( content.length > 0 || content.byteLength > 0 ) {

						contentAsText = THREE.LoaderUtils.decodeText( content );

					} else {

						this._throwError( 'Unable to parse mtl as it it seems to be neither a String, an Array or an ArrayBuffer!' );
					}

				}
				processMaterials( mtlLoader.parse( contentAsText ) );
			};

			if ( THREE.LoaderSupport.Validator.isValid( resource.content ) ) {

				parseTextWithMtlLoader( resource.content );

			} else if ( THREE.LoaderSupport.Validator.isValid( resource.url ) ) {

				var fileLoader = new THREE.FileLoader( this.manager );
				if ( ! THREE.LoaderSupport.Validator.isValid( onError ) ) {
					onError = function ( event ) {
						scope._onError( event );
					}
				}
				if ( ! THREE.LoaderSupport.Validator.isValid( onProgress ) ) {
					var numericalValueRef = 0;
					var numericalValue = 0;
					onProgress = function ( event ) {
						if ( ! event.lengthComputable ) return;

						numericalValue = event.loaded / event.total;
						if ( numericalValue > numericalValueRef ) {

							numericalValueRef = numericalValue;
							var output = 'Download of "' + resource.url + '": ' + ( numericalValue * 100 ).toFixed( 2 ) + '%';
							scope.onProgress( 'progressLoad', output, numericalValue );

						}
					};
				}

				fileLoader.load( resource.url, parseTextWithMtlLoader, onProgress, onError );

			}
		}
	}
};


/**
 * Parse OBJ data either from ArrayBuffer or string
 * @class
 */
THREE.OBJLoader2.Parser = function () {
	this.callbackProgress = null;
	this.callbackMeshBuilder = null;
	this.contentRef = null;
	this.legacyMode = false;

	this.materials = {};
	this.useAsync = false;
	this.materialPerSmoothingGroup = false;
	this.useOAsMesh = false;
	this.useIndices = false;
	this.disregardNormals = false;

	this.vertices = [];
	this.colors = [];
	this.normals = [];
	this.uvs = [];

	this.rawMesh = {
		objectName: '',
		groupName: '',
		activeMtlName: '',
		mtllibName: '',

		// reset with new mesh
		faceType: -1,
		subGroups: [],
		subGroupInUse: null,
		smoothingGroup: {
			splitMaterials: false,
			normalized: -1,
			real: -1
		},
		counts: {
			doubleIndicesCount: 0,
			faceCount: 0,
			mtlCount: 0,
			smoothingGroupCount: 0
		}
	};

	this.inputObjectCount = 1;
	this.outputObjectCount = 1;
	this.globalCounts = {
		vertices: 0,
		faces: 0,
		doubleIndicesCount: 0,
		lineByte: 0,
		currentByte: 0,
		totalBytes: 0
	};

	this.logging = {
		enabled: true,
		debug: false
	};
};


THREE.OBJLoader2.Parser.prototype = {

	constructor: THREE.OBJLoader2.Parser,

	resetRawMesh: function () {
		// faces are stored according combined index of group, material and smoothingGroup (0 or not)
		this.rawMesh.subGroups = [];
		this.rawMesh.subGroupInUse = null;
		this.rawMesh.smoothingGroup.normalized = -1;
		this.rawMesh.smoothingGroup.real = -1;

		// this default index is required as it is possible to define faces without 'g' or 'usemtl'
		this.pushSmoothingGroup( 1 );

		this.rawMesh.counts.doubleIndicesCount = 0;
		this.rawMesh.counts.faceCount = 0;
		this.rawMesh.counts.mtlCount = 0;
		this.rawMesh.counts.smoothingGroupCount = 0;
	},

	setUseAsync: function ( useAsync ) {
		this.useAsync = useAsync;
	},

	setMaterialPerSmoothingGroup: function ( materialPerSmoothingGroup ) {
		this.materialPerSmoothingGroup = materialPerSmoothingGroup;
	},

	setUseOAsMesh: function ( useOAsMesh ) {
		this.useOAsMesh = useOAsMesh;
	},

	setUseIndices: function ( useIndices ) {
		this.useIndices = useIndices;
	},

	setDisregardNormals: function ( disregardNormals ) {
		this.disregardNormals = disregardNormals;
	},

	setMaterials: function ( materials ) {
		this.materials = THREE.LoaderSupport.Validator.verifyInput( materials, this.materials );
		this.materials = THREE.LoaderSupport.Validator.verifyInput( this.materials, {} );
	},

	setCallbackMeshBuilder: function ( callbackMeshBuilder ) {
		if ( ! THREE.LoaderSupport.Validator.isValid( callbackMeshBuilder ) ) {

			this._throwError( 'Unable to run as no "MeshBuilder" callback is set.' );

		}
		this.callbackMeshBuilder = callbackMeshBuilder;
	},

	setCallbackProgress: function ( callbackProgress ) {
		this.callbackProgress = callbackProgress;
	},

	setLogging: function ( enabled, debug ) {
		this.logging.enabled = enabled === true;
		this.logging.debug = debug === true;
	},

	configure: function () {
		this.pushSmoothingGroup( 1 );

		if ( this.logging.enabled ) {

			var matKeys = Object.keys( this.materials );
			var matNames = ( matKeys.length > 0 ) ? '\n\tmaterialNames:\n\t\t- ' + matKeys.join( '\n\t\t- ' ) : '\n\tmaterialNames: None';
			var printedConfig = 'OBJLoader2.Parser configuration:'
				+ matNames
				+ '\n\tuseAsync: ' + this.useAsync
				+ '\n\tmaterialPerSmoothingGroup: ' + this.materialPerSmoothingGroup
				+ '\n\tuseOAsMesh: ' + this.useOAsMesh
				+ '\n\tuseIndices: ' + this.useIndices
				+ '\n\tdisregardNormals: ' + this.disregardNormals
				+ '\n\tcallbackMeshBuilderName: ' + this.callbackMeshBuilder.name
				+ '\n\tcallbackProgressName: ' + this.callbackProgress.name;
			console.info( printedConfig );
		}
	},

	/**
	 * Parse the provided arraybuffer
	 *
	 * @param {Uint8Array} arrayBuffer OBJ data as Uint8Array
	 */
	parse: function ( arrayBuffer ) {
		if ( this.logging.enabled ) console.time( 'OBJLoader2.Parser.parse' );
		this.configure();

		var arrayBufferView = new Uint8Array( arrayBuffer );
		this.contentRef = arrayBufferView;
		var length = arrayBufferView.byteLength;
		this.globalCounts.totalBytes = length;
		var buffer = new Array( 128 );

		for ( var code, word = '', bufferPointer = 0, slashesCount = 0, i = 0; i < length; i++ ) {

			code = arrayBufferView[ i ];
			switch ( code ) {
				// space
				case 32:
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					word = '';
					break;
				// slash
				case 47:
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					slashesCount++;
					word = '';
					break;

				// LF
				case 10:
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					word = '';
					this.globalCounts.lineByte = this.globalCounts.currentByte;
					this.globalCounts.currentByte = i;
					this.processLine( buffer, bufferPointer, slashesCount );
					bufferPointer = 0;
					slashesCount = 0;
					break;

				// CR
				case 13:
					break;

				default:
					word += String.fromCharCode( code );
					break;
			}
		}
		this.finalizeParsing();
		if ( this.logging.enabled ) console.timeEnd(  'OBJLoader2.Parser.parse' );
	},

	/**
	 * Parse the provided text
	 *
	 * @param {string} text OBJ data as string
	 */
	parseText: function ( text ) {
		if ( this.logging.enabled ) console.time(  'OBJLoader2.Parser.parseText' );
		this.configure();
		this.legacyMode = true;
		this.contentRef = text;
		var length = text.length;
		this.globalCounts.totalBytes = length;
		var buffer = new Array( 128 );

		for ( var char, word = '', bufferPointer = 0, slashesCount = 0, i = 0; i < length; i++ ) {

			char = text[ i ];
			switch ( char ) {
				case ' ':
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					word = '';
					break;

				case '/':
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					slashesCount++;
					word = '';
					break;

				case '\n':
					if ( word.length > 0 ) buffer[ bufferPointer++ ] = word;
					word = '';
					this.globalCounts.lineByte = this.globalCounts.currentByte;
					this.globalCounts.currentByte = i;
					this.processLine( buffer, bufferPointer, slashesCount );
					bufferPointer = 0;
					slashesCount = 0;
					break;

				case '\r':
					break;

				default:
					word += char;
			}
		}
		this.finalizeParsing();
		if ( this.logging.enabled ) console.timeEnd( 'OBJLoader2.Parser.parseText' );
	},

	processLine: function ( buffer, bufferPointer, slashesCount ) {
		if ( bufferPointer < 1 ) return;

		var reconstructString = function ( content, legacyMode, start, stop ) {
			var line = '';
			if ( stop > start ) {

				var i;
				if ( legacyMode ) {

					for ( i = start; i < stop; i++ ) line += content[ i ];

				} else {


					for ( i = start; i < stop; i++ ) line += String.fromCharCode( content[ i ] );

				}
				line = line.trim();

			}
			return line;
		};

		var bufferLength, length, i, lineDesignation;
		lineDesignation = buffer [ 0 ];
		switch ( lineDesignation ) {
			case 'v':
				this.vertices.push( parseFloat( buffer[ 1 ] ) );
				this.vertices.push( parseFloat( buffer[ 2 ] ) );
				this.vertices.push( parseFloat( buffer[ 3 ] ) );
				if ( bufferPointer > 4 ) {

					this.colors.push( parseFloat( buffer[ 4 ] ) );
					this.colors.push( parseFloat( buffer[ 5 ] ) );
					this.colors.push( parseFloat( buffer[ 6 ] ) );

				}
				break;

			case 'vt':
				this.uvs.push( parseFloat( buffer[ 1 ] ) );
				this.uvs.push( parseFloat( buffer[ 2 ] ) );
				break;

			case 'vn':
				this.normals.push( parseFloat( buffer[ 1 ] ) );
				this.normals.push( parseFloat( buffer[ 2 ] ) );
				this.normals.push( parseFloat( buffer[ 3 ] ) );
				break;

			case 'f':
				bufferLength = bufferPointer - 1;

				// "f vertex ..."
				if ( slashesCount === 0 ) {

					this.checkFaceType( 0 );
					for ( i = 2, length = bufferLength; i < length; i ++ ) {

						this.buildFace( buffer[ 1 ] );
						this.buildFace( buffer[ i ] );
						this.buildFace( buffer[ i + 1 ] );

					}

					// "f vertex/uv ..."
				} else if  ( bufferLength === slashesCount * 2 ) {

					this.checkFaceType( 1 );
					for ( i = 3, length = bufferLength - 2; i < length; i += 2 ) {

						this.buildFace( buffer[ 1 ], buffer[ 2 ] );
						this.buildFace( buffer[ i ], buffer[ i + 1 ] );
						this.buildFace( buffer[ i + 2 ], buffer[ i + 3 ] );

					}

					// "f vertex/uv/normal ..."
				} else if  ( bufferLength * 2 === slashesCount * 3 ) {

					this.checkFaceType( 2 );
					for ( i = 4, length = bufferLength - 3; i < length; i += 3 ) {

						this.buildFace( buffer[ 1 ], buffer[ 2 ], buffer[ 3 ] );
						this.buildFace( buffer[ i ], buffer[ i + 1 ], buffer[ i + 2 ] );
						this.buildFace( buffer[ i + 3 ], buffer[ i + 4 ], buffer[ i + 5 ] );

					}

					// "f vertex//normal ..."
				} else {

					this.checkFaceType( 3 );
					for ( i = 3, length = bufferLength - 2; i < length; i += 2 ) {

						this.buildFace( buffer[ 1 ], undefined, buffer[ 2 ] );
						this.buildFace( buffer[ i ], undefined, buffer[ i + 1 ] );
						this.buildFace( buffer[ i + 2 ], undefined, buffer[ i + 3 ] );

					}

				}
				break;

			case 'l':
			case 'p':
				bufferLength = bufferPointer - 1;
				if ( bufferLength === slashesCount * 2 )  {

					this.checkFaceType( 4 );
					for ( i = 1, length = bufferLength + 1; i < length; i += 2 ) this.buildFace( buffer[ i ], buffer[ i + 1 ] );

				} else {

					this.checkFaceType( ( lineDesignation === 'l' ) ? 5 : 6  );
					for ( i = 1, length = bufferLength + 1; i < length; i ++ ) this.buildFace( buffer[ i ] );

				}
				break;

			case 's':
				this.pushSmoothingGroup( buffer[ 1 ] );
				break;

			case 'g':
				// 'g' leads to creation of mesh if valid data (faces declaration was done before), otherwise only groupName gets set
				this.processCompletedMesh();
				this.rawMesh.groupName = reconstructString( this.contentRef, this.legacyMode, this.globalCounts.lineByte + 2, this.globalCounts.currentByte );
				break;

			case 'o':
				// 'o' is meta-information and usually does not result in creation of new meshes, but can be enforced with "useOAsMesh"
				if ( this.useOAsMesh ) this.processCompletedMesh();
				this.rawMesh.objectName = reconstructString( this.contentRef, this.legacyMode, this.globalCounts.lineByte + 2, this.globalCounts.currentByte );
				break;

			case 'mtllib':
				this.rawMesh.mtllibName = reconstructString( this.contentRef, this.legacyMode, this.globalCounts.lineByte + 7, this.globalCounts.currentByte );
				break;

			case 'usemtl':
				var mtlName = reconstructString( this.contentRef, this.legacyMode, this.globalCounts.lineByte + 7, this.globalCounts.currentByte );
				if ( mtlName !== '' && this.rawMesh.activeMtlName !== mtlName ) {

					this.rawMesh.activeMtlName = mtlName;
					this.rawMesh.counts.mtlCount++;
					this.checkSubGroup();

				}
				break;

			default:
				break;
		}
	},

	pushSmoothingGroup: function ( smoothingGroup ) {
		var smoothingGroupInt = parseInt( smoothingGroup );
		if ( isNaN( smoothingGroupInt ) ) {
			smoothingGroupInt = smoothingGroup === "off" ? 0 : 1;
		}

		var smoothCheck = this.rawMesh.smoothingGroup.normalized;
		this.rawMesh.smoothingGroup.normalized = this.rawMesh.smoothingGroup.splitMaterials ? smoothingGroupInt : ( smoothingGroupInt === 0 ) ? 0 : 1;
		this.rawMesh.smoothingGroup.real = smoothingGroupInt;

		if ( smoothCheck !== smoothingGroupInt ) {

			this.rawMesh.counts.smoothingGroupCount++;
			this.checkSubGroup();

		}
	},

	/**
	 * Expanded faceTypes include all four face types, both line types and the point type
	 * faceType = 0: "f vertex ..."
	 * faceType = 1: "f vertex/uv ..."
	 * faceType = 2: "f vertex/uv/normal ..."
	 * faceType = 3: "f vertex//normal ..."
	 * faceType = 4: "l vertex/uv ..." or "l vertex ..."
	 * faceType = 5: "l vertex ..."
	 * faceType = 6: "p vertex ..."
	 */
	checkFaceType: function ( faceType ) {
		if ( this.rawMesh.faceType !== faceType ) {

			this.processCompletedMesh();
			this.rawMesh.faceType = faceType;
			this.checkSubGroup();

		}
	},

	checkSubGroup: function () {
		var index = this.rawMesh.activeMtlName + '|' + this.rawMesh.smoothingGroup.normalized;
		this.rawMesh.subGroupInUse = this.rawMesh.subGroups[ index ];

		if ( ! THREE.LoaderSupport.Validator.isValid( this.rawMesh.subGroupInUse ) ) {

			this.rawMesh.subGroupInUse = {
				index: index,
				objectName: this.rawMesh.objectName,
				groupName: this.rawMesh.groupName,
				materialName: this.rawMesh.activeMtlName,
				smoothingGroup: this.rawMesh.smoothingGroup.normalized,
				vertices: [],
				indexMappingsCount: 0,
				indexMappings: [],
				indices: [],
				colors: [],
				uvs: [],
				normals: []
			};
			this.rawMesh.subGroups[ index ] = this.rawMesh.subGroupInUse;

		}
	},

	buildFace: function ( faceIndexV, faceIndexU, faceIndexN ) {
		if ( this.disregardNormals ) faceIndexN = undefined;
		var scope = this;
		var updateSubGroupInUse = function () {

			var faceIndexVi = parseInt( faceIndexV );
			var indexPointerV = 3 * ( faceIndexVi > 0 ? faceIndexVi - 1 : faceIndexVi + scope.vertices.length / 3 );
			var indexPointerC = scope.colors.length > 0 ? indexPointerV : null;

			var vertices = scope.rawMesh.subGroupInUse.vertices;
			vertices.push( scope.vertices[ indexPointerV++ ] );
			vertices.push( scope.vertices[ indexPointerV++ ] );
			vertices.push( scope.vertices[ indexPointerV ] );

			if ( indexPointerC !== null ) {

				var colors = scope.rawMesh.subGroupInUse.colors;
				colors.push( scope.colors[ indexPointerC++ ] );
				colors.push( scope.colors[ indexPointerC++ ] );
				colors.push( scope.colors[ indexPointerC ] );

			}
			if ( faceIndexU ) {

				var faceIndexUi = parseInt( faceIndexU );
				var indexPointerU = 2 * ( faceIndexUi > 0 ? faceIndexUi - 1 : faceIndexUi + scope.uvs.length / 2 );
				var uvs = scope.rawMesh.subGroupInUse.uvs;
				uvs.push( scope.uvs[ indexPointerU++ ] );
				uvs.push( scope.uvs[ indexPointerU ] );

			}
			if ( faceIndexN ) {

				var faceIndexNi = parseInt( faceIndexN );
				var indexPointerN = 3 * ( faceIndexNi > 0 ? faceIndexNi - 1 : faceIndexNi + scope.normals.length / 3 );
				var normals = scope.rawMesh.subGroupInUse.normals;
				normals.push( scope.normals[ indexPointerN++ ] );
				normals.push( scope.normals[ indexPointerN++ ] );
				normals.push( scope.normals[ indexPointerN ] );

			}
		};

		if ( this.useIndices ) {

			var mappingName = faceIndexV + ( faceIndexU ? '_' + faceIndexU : '_n' ) + ( faceIndexN ? '_' + faceIndexN : '_n' );
			var indicesPointer = this.rawMesh.subGroupInUse.indexMappings[ mappingName ];
			if ( THREE.LoaderSupport.Validator.isValid( indicesPointer ) ) {

				this.rawMesh.counts.doubleIndicesCount++;

			} else {

				indicesPointer = this.rawMesh.subGroupInUse.vertices.length / 3;
				updateSubGroupInUse();
				this.rawMesh.subGroupInUse.indexMappings[ mappingName ] = indicesPointer;
				this.rawMesh.subGroupInUse.indexMappingsCount++;

			}
			this.rawMesh.subGroupInUse.indices.push( indicesPointer );

		} else {

			updateSubGroupInUse();

		}
		this.rawMesh.counts.faceCount++;
	},

	createRawMeshReport: function ( inputObjectCount ) {
		return 'Input Object number: ' + inputObjectCount +
			'\n\tObject name: ' + this.rawMesh.objectName +
			'\n\tGroup name: ' + this.rawMesh.groupName +
			'\n\tMtllib name: ' + this.rawMesh.mtllibName +
			'\n\tVertex count: ' + this.vertices.length / 3 +
			'\n\tNormal count: ' + this.normals.length / 3 +
			'\n\tUV count: ' + this.uvs.length / 2 +
			'\n\tSmoothingGroup count: ' + this.rawMesh.counts.smoothingGroupCount +
			'\n\tMaterial count: ' + this.rawMesh.counts.mtlCount +
			'\n\tReal MeshOutputGroup count: ' + this.rawMesh.subGroups.length;
	},

	/**
	 * Clear any empty subGroup and calculate absolute vertex, normal and uv counts
	 */
	finalizeRawMesh: function () {
		var meshOutputGroupTemp = [];
		var meshOutputGroup;
		var absoluteVertexCount = 0;
		var absoluteIndexMappingsCount = 0;
		var absoluteIndexCount = 0;
		var absoluteColorCount = 0;
		var absoluteNormalCount = 0;
		var absoluteUvCount = 0;
		var indices;
		for ( var name in this.rawMesh.subGroups ) {

			meshOutputGroup = this.rawMesh.subGroups[ name ];
			if ( meshOutputGroup.vertices.length > 0 ) {

				indices = meshOutputGroup.indices;
				if ( indices.length > 0 && absoluteIndexMappingsCount > 0 ) {

					for ( var i in indices ) indices[ i ] = indices[ i ] + absoluteIndexMappingsCount;

				}
				meshOutputGroupTemp.push( meshOutputGroup );
				absoluteVertexCount += meshOutputGroup.vertices.length;
				absoluteIndexMappingsCount += meshOutputGroup.indexMappingsCount;
				absoluteIndexCount += meshOutputGroup.indices.length;
				absoluteColorCount += meshOutputGroup.colors.length;
				absoluteUvCount += meshOutputGroup.uvs.length;
				absoluteNormalCount += meshOutputGroup.normals.length;

			}
		}

		// do not continue if no result
		var result = null;
		if ( meshOutputGroupTemp.length > 0 ) {

			result = {
				name: this.rawMesh.groupName !== '' ? this.rawMesh.groupName : this.rawMesh.objectName,
				subGroups: meshOutputGroupTemp,
				absoluteVertexCount: absoluteVertexCount,
				absoluteIndexCount: absoluteIndexCount,
				absoluteColorCount: absoluteColorCount,
				absoluteNormalCount: absoluteNormalCount,
				absoluteUvCount: absoluteUvCount,
				faceCount: this.rawMesh.counts.faceCount,
				doubleIndicesCount: this.rawMesh.counts.doubleIndicesCount
			};

		}
		return result;
	},

	processCompletedMesh: function () {
		var result = this.finalizeRawMesh();
		if ( THREE.LoaderSupport.Validator.isValid( result ) ) {

			if ( this.colors.length > 0 && this.colors.length !== this.vertices.length ) {

				this._throwError( 'Vertex Colors were detected, but vertex count and color count do not match!' );

			}
			if ( this.logging.enabled && this.logging.debug ) console.debug( this.createRawMeshReport( this.inputObjectCount ) );
			this.inputObjectCount++;

			this.buildMesh( result );
			var progressBytesPercent = this.globalCounts.currentByte / this.globalCounts.totalBytes;
			this.callbackProgress( 'Completed [o: ' + this.rawMesh.objectName + ' g:' + this.rawMesh.groupName + '] Total progress: ' + ( progressBytesPercent * 100 ).toFixed( 2 ) + '%', progressBytesPercent );
			this.resetRawMesh();
			return true;

		} else {

			return false;
		}
	},

	/**
	 * SubGroups are transformed to too intermediate format that is forwarded to the MeshBuilder.
	 * It is ensured that SubGroups only contain objects with vertices (no need to check).
	 *
	 * @param result
	 */
	buildMesh: function ( result ) {
		var meshOutputGroups = result.subGroups;

		var vertexFA = new Float32Array( result.absoluteVertexCount );
		this.globalCounts.vertices += result.absoluteVertexCount / 3;
		this.globalCounts.faces += result.faceCount;
		this.globalCounts.doubleIndicesCount += result.doubleIndicesCount;
		var indexUA = ( result.absoluteIndexCount > 0 ) ? new Uint32Array( result.absoluteIndexCount ) : null;
		var colorFA = ( result.absoluteColorCount > 0 ) ? new Float32Array( result.absoluteColorCount ) : null;
		var normalFA = ( result.absoluteNormalCount > 0 ) ? new Float32Array( result.absoluteNormalCount ) : null;
		var uvFA = ( result.absoluteUvCount > 0 ) ? new Float32Array( result.absoluteUvCount ) : null;
		var haveVertexColors = THREE.LoaderSupport.Validator.isValid( colorFA );

		var meshOutputGroup;
		var materialNames = [];

		var createMultiMaterial = ( meshOutputGroups.length > 1 );
		var materialIndex = 0;
		var materialIndexMapping = [];
		var selectedMaterialIndex;
		var materialGroup;
		var materialGroups = [];

		var vertexFAOffset = 0;
		var indexUAOffset = 0;
		var colorFAOffset = 0;
		var normalFAOffset = 0;
		var uvFAOffset = 0;
		var materialGroupOffset = 0;
		var materialGroupLength = 0;

		var materialOrg, material, materialName, materialNameOrg;
		// only one specific face type
		for ( var oodIndex in meshOutputGroups ) {

			if ( ! meshOutputGroups.hasOwnProperty( oodIndex ) ) continue;
			meshOutputGroup = meshOutputGroups[ oodIndex ];

			materialNameOrg = meshOutputGroup.materialName;
			if ( this.rawMesh.faceType < 4 ) {

				materialName = materialNameOrg + ( haveVertexColors ? '_vertexColor' : '' ) + ( meshOutputGroup.smoothingGroup === 0 ? '_flat' : '' );


			} else {

				materialName = this.rawMesh.faceType === 6 ? 'defaultPointMaterial' : 'defaultLineMaterial';

			}
			materialOrg = this.materials[ materialNameOrg ];
			material = this.materials[ materialName ];

			// both original and derived names do not lead to an existing material => need to use a default material
			if ( ! THREE.LoaderSupport.Validator.isValid( materialOrg ) && ! THREE.LoaderSupport.Validator.isValid( material ) ) {

				var defaultMaterialName = haveVertexColors ? 'defaultVertexColorMaterial' : 'defaultMaterial';
				materialOrg = this.materials[ defaultMaterialName ];
				if ( this.logging.enabled ) console.warn( 'object_group "' + meshOutputGroup.objectName + '_' +
					meshOutputGroup.groupName + '" was defined with unresolvable material "' +
					materialNameOrg + '"! Assigning "' + defaultMaterialName + '".' );
				materialNameOrg = defaultMaterialName;

				// if names are identical then there is no need for later manipulation
				if ( materialNameOrg === materialName ) {

					material = materialOrg;
					materialName = defaultMaterialName;

				}

			}
			if ( ! THREE.LoaderSupport.Validator.isValid( material ) ) {

				var materialCloneInstructions = {
					materialNameOrg: materialNameOrg,
					materialName: materialName,
					materialProperties: {
						vertexColors: haveVertexColors ? 2 : 0,
						flatShading: meshOutputGroup.smoothingGroup === 0
					}
				};
				var payload = {
					cmd: 'materialData',
					materials: {
						materialCloneInstructions: materialCloneInstructions
					}
				};
				this.callbackMeshBuilder( payload );

				// fake entry for async; sync Parser always works on material references (Builder update directly visible here)
				if ( this.useAsync ) this.materials[ materialName ] = materialCloneInstructions;

			}

			if ( createMultiMaterial ) {

				// re-use material if already used before. Reduces materials array size and eliminates duplicates
				selectedMaterialIndex = materialIndexMapping[ materialName ];
				if ( ! selectedMaterialIndex ) {

					selectedMaterialIndex = materialIndex;
					materialIndexMapping[ materialName ] = materialIndex;
					materialNames.push( materialName );
					materialIndex++;

				}
				materialGroupLength = this.useIndices ? meshOutputGroup.indices.length : meshOutputGroup.vertices.length / 3;
				materialGroup = {
					start: materialGroupOffset,
					count: materialGroupLength,
					index: selectedMaterialIndex
				};
				materialGroups.push( materialGroup );
				materialGroupOffset += materialGroupLength;

			} else {

				materialNames.push( materialName );

			}

			vertexFA.set( meshOutputGroup.vertices, vertexFAOffset );
			vertexFAOffset += meshOutputGroup.vertices.length;

			if ( indexUA ) {

				indexUA.set( meshOutputGroup.indices, indexUAOffset );
				indexUAOffset += meshOutputGroup.indices.length;

			}

			if ( colorFA ) {

				colorFA.set( meshOutputGroup.colors, colorFAOffset );
				colorFAOffset += meshOutputGroup.colors.length;

			}

			if ( normalFA ) {

				normalFA.set( meshOutputGroup.normals, normalFAOffset );
				normalFAOffset += meshOutputGroup.normals.length;

			}
			if ( uvFA ) {

				uvFA.set( meshOutputGroup.uvs, uvFAOffset );
				uvFAOffset += meshOutputGroup.uvs.length;

			}

			if ( this.logging.enabled && this.logging.debug ) {
				var materialIndexLine = THREE.LoaderSupport.Validator.isValid( selectedMaterialIndex ) ? '\n\t\tmaterialIndex: ' + selectedMaterialIndex : '';
				var createdReport = '\tOutput Object no.: ' + this.outputObjectCount +
					'\n\t\tgroupName: ' + meshOutputGroup.groupName +
					'\n\t\tIndex: ' + meshOutputGroup.index +
					'\n\t\tfaceType: ' + this.rawMesh.faceType +
					'\n\t\tmaterialName: ' + meshOutputGroup.materialName +
					'\n\t\tsmoothingGroup: ' + meshOutputGroup.smoothingGroup +
					materialIndexLine +
					'\n\t\tobjectName: ' + meshOutputGroup.objectName +
					'\n\t\t#vertices: ' + meshOutputGroup.vertices.length / 3 +
					'\n\t\t#indices: ' + meshOutputGroup.indices.length +
					'\n\t\t#colors: ' + meshOutputGroup.colors.length / 3 +
					'\n\t\t#uvs: ' + meshOutputGroup.uvs.length / 2 +
					'\n\t\t#normals: ' + meshOutputGroup.normals.length / 3;
				console.debug( createdReport );
			}

		}

		this.outputObjectCount++;
		this.callbackMeshBuilder(
			{
				cmd: 'meshData',
				progress: {
					numericalValue: this.globalCounts.currentByte / this.globalCounts.totalBytes
				},
				params: {
					meshName: result.name
				},
				materials: {
					multiMaterial: createMultiMaterial,
					materialNames: materialNames,
					materialGroups: materialGroups
				},
				buffers: {
					vertices: vertexFA,
					indices: indexUA,
					colors: colorFA,
					normals: normalFA,
					uvs: uvFA
				},
				// 0: mesh, 1: line, 2: point
				geometryType: this.rawMesh.faceType < 4 ? 0 : ( this.rawMesh.faceType === 6 ) ? 2 : 1
			},
			[ vertexFA.buffer ],
			THREE.LoaderSupport.Validator.isValid( indexUA ) ? [ indexUA.buffer ] : null,
			THREE.LoaderSupport.Validator.isValid( colorFA ) ? [ colorFA.buffer ] : null,
			THREE.LoaderSupport.Validator.isValid( normalFA ) ? [ normalFA.buffer ] : null,
			THREE.LoaderSupport.Validator.isValid( uvFA ) ? [ uvFA.buffer ] : null
		);
	},

	finalizeParsing: function () {
		if ( this.logging.enabled ) console.info( 'Global output object count: ' + this.outputObjectCount );
		if ( this.processCompletedMesh() && this.logging.enabled ) {

			var parserFinalReport = 'Overall counts: ' +
				'\n\tVertices: ' + this.globalCounts.vertices +
				'\n\tFaces: ' + this.globalCounts.faces +
				'\n\tMultiple definitions: ' + this.globalCounts.doubleIndicesCount;
			console.info( parserFinalReport );

		}
	}
};


/////////////////////////////////////////////////////
//FABRICJS basico
var canvas = new fabric.Canvas("cnvs");
canvas.backgroundColor = 'yellow';
canvas.on("after:render", function () {
  mesh.material.map.needsUpdate = true;
});

var text = new fabric.IText("Three.js\n", {
  'fontSize': 0x28,
  'textAlign': "center",
  'fontWeight': 'bold',
  'left': 0x80,
  'top': 0x80,
  'angle': 0x1e,
  'originX': "center",
  'originY': "center",
  'shadow': "blue -5px 6px 5px"
});
canvas.add(text);

var imgElement = document.getElementById("wiki");
var imageinstance = new fabric.Image(imgElement, {
  'angle': 0x0,
  'left': 0x12c,
  'opacity': 0x1,
  'cornerSize': 0x1e
});
canvas.add(imageinstance);


//////////////////////////////////////////////////////////
//THREEJS basico
var camera;
var renderer;
var container;
var scene;
var texture;
var material;
var geometry;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(0x3c, window.innerWidth / window.innerHeight, 0x1, 0x3e8);
camera.position.set(0x0, 0x0, 0xa);
var raycaster = new THREE.Raycaster();           //RAYCS
var mouse = new THREE.Vector2();
var onClickPosition = new THREE.Vector2();
var isMobile = false;
container = document.getElementById("renderer");
renderer = new THREE.WebGLRenderer({
  'antialias': true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.updateProjectionMatrix();
container.appendChild(renderer.domElement);
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(0xa);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0x1));



//aca armamos una mesh , con una geometria y la textura del canvas 

////////////////// USAMOS CANVAS DE FBRC COMO TXT EN THREE
var canvasTexture = new THREE.CanvasTexture(cnvs);




const loader = new OBJLoader2();
loader.load(
  './shirt.obj', // Reemplaza con la ruta a tu archivo .obj
  function (obj) {
    // Aplica la textura del canvas a todos los materiales del objeto cargado
    obj.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: canvasTexture,
          metalness: 0.25,
          roughness: 0.25
        });
      }
    });

    // Ajusta la posición o escala del modelo si es necesario
    obj.position.set(0, 0, 0);
    obj.scale.set(1, 1, 1);

    // Agrega el modelo cargado a la escena
    scene.add(obj);
  },
  // Función de progreso opcional
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
  },
  // Función de error
  function (error) {
    console.error('Error al cargar el modelo:', error);
  }
);


//ARMAMOS UNA GEOMETRIA 
//var geometry = new THREE.PlaneGeometry(10, 10, 20, 20);




//PRIMEROS USOS DE VALORES HEXADECIMALES COMO NOMBRES DE VARIABLES (OFUSCACION)
//geometry.vertices.forEach(_0x56b6e2 => {
//  _0x56b6e2.z = Math.cos(_0x56b6e2.x) * Math.sin(-_0x56b6e2.y * 0.5) * 0.5;
//});
//geometry.computeFaceNormals();
//geometry.computeVertexNormals();





//DEFINIMOS MESH CON GEOMETRIA Y TEXTURA DEL CANVAS DE FABRICJS
//var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
//  'map': canvasTexture,
//  'metalness': 0.25,
//  'roughness': 0.25
//}));

//ADD A LA SCENE
//scene.add(mesh);

//  MOTORCITO DE THREEJS
// (loop de renderizado)
function animateRandom() {}
animateRandom();
setInterval(animateRandom, 0x3e8);
var clock = new THREE.Clock();
var time = 0x0;

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  renderer.render(scene, camera);
}
render();

fabric.Canvas.prototype.getPointer = function (_0x2fd889, _0x112d2f) { 
             //SE RECIBNEN 2 VARIABLES HXDCM COMO ARGUNMENTOS DE LA FUNCION 
  if (this._absolutePointer && !_0x112d2f) {
    return this._absolutePointer;
  }
  if (this._pointer && _0x112d2f) {
    return this._pointer;
  }
  var _0x49c1c2;
//NUEVA VARIABLE HEXADECIMAL
  if (_0x2fd889.touches != undefined) {

    _0x49c1c2 = new MouseEvent({
      'touchstart': "mousedown",
      'touchmove': "mousemove",
      'touchend': "mouseup"
    }[_0x2fd889.type], {
      'bubbles': true,
      'cancelable': true,
      'view': window,
      'detail': 0x1,
      'screenX': Math.round(_0x2fd889.changedTouches[0x0].screenX),
      'screenY': Math.round(_0x2fd889.changedTouches[0x0].screenY),
      'clientX': Math.round(_0x2fd889.changedTouches[0x0].clientX),
      'clientY': Math.round(_0x2fd889.changedTouches[0x0].clientY),
      'ctrlKey': false,
      'altKey': false,
      'shiftKey': false,
      'metaKey': false,
      'button': 0x0,
      'relatedTarget': null
    });
//DEFINE MUCHAS (6)
    var _0x305925 = fabric.util.getPointer(_0x49c1c2);
    var _0x1d2264 = this.upperCanvasEl;
    var _0x50f9ea = _0x1d2264.getBoundingClientRect();
    var _0x481a5f = _0x50f9ea.width || 0x0;
    var _0x2f2f25 = _0x50f9ea.height || 0x0;
    var _0x2dd35c;
  } else {
    var _0x305925 = fabric.util.getPointer(_0x2fd889);
    var _0x1d2264 = this.upperCanvasEl;
    var _0x50f9ea = _0x1d2264.getBoundingClientRect();
    var _0x481a5f = _0x50f9ea.width || 0x0;
    var _0x2f2f25 = _0x50f9ea.height || 0x0;
    var _0x2dd35c;
  }




//LOGICA:

  if (!_0x481a5f || !_0x2f2f25) {
    if ('top' in _0x50f9ea && "bottom" in _0x50f9ea) {
      _0x2f2f25 = Math.abs(_0x50f9ea.top - _0x50f9ea.bottom);
    }
    if ("right" in _0x50f9ea && "left" in _0x50f9ea) {
      _0x481a5f = Math.abs(_0x50f9ea.right - _0x50f9ea.left);
    }
  }
  this.calcOffset();
  
  _0x305925.x = _0x305925.x - this._offset.left;
  _0x305925.y = _0x305925.y - this._offset.top;
  
  
  
  
  
  if (_0x2fd889.target !== this.upperCanvasEl) {
    var _0x48231a;
    if (isMobile == true) {
      _0x48231a = getPositionOnSceneTouch(container, _0x2fd889);
      if (_0x48231a) {
        console.log(_0x48231a);
        _0x305925.x = _0x48231a.x;
        _0x305925.y = _0x48231a.y;
      }
    } else {
      _0x48231a = getPositionOnScene(container, _0x2fd889);
      if (_0x48231a) {
        console.log(_0x48231a);
        _0x305925.x = _0x48231a.x;
        _0x305925.y = _0x48231a.y;
      }
    }
  }



  if (!_0x112d2f) {
    _0x305925 = this.restorePointerVpt(_0x305925);
  }
  
  
  if (_0x481a5f === 0x0 || _0x2f2f25 === 0x0) {
    _0x2dd35c = {
      'width': 0x1,
      'height': 0x1
    };
  } else {
    _0x2dd35c = {
      'width': _0x1d2264.width / _0x481a5f,
      'height': _0x1d2264.height / _0x2f2f25
    };
  }

  return {
    'x': _0x305925.x * _0x2dd35c.width,
    'y': _0x305925.y * _0x2dd35c.height
  };
};            //  F I N  CUSTOM GETpOINTER







container.addEventListener("mousedown", onMouseEvt, false);



if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0x0, 0x4))) {
  isMobile = true;
  container.addEventListener('touchstart', onTouch, false);
}




//FUNCIONES Y HELPERS DE ONTOUCH Y ONMOUSE EVETNT

function onTouch(_0x2c7070) {
  _0x2c7070.preventDefault();
  const _0x5bff07 = getPositionOnSceneTouch(container, _0x2c7070);
  if (_0x5bff07) {
    const _0x10895f = canvas._offset;
    const _0x53a8fa = new MouseEvent(_0x2c7070.type, {
      'clientX': _0x10895f.left + _0x5bff07.x,
      'clientY': _0x10895f.top + _0x5bff07.y
    });
    canvas.upperCanvasEl.dispatchEvent(_0x53a8fa);
  }
}

function getPositionOnSceneTouch(_0x7b52e8, _0xd8dbfe) {
  var _0x503c0b = getMousePosition(_0x7b52e8, _0xd8dbfe.changedTouches[0x0].clientX, _0xd8dbfe.changedTouches[0x0].clientY);
  onClickPosition.fromArray(_0x503c0b);
  console.log(scene);
  var _0x55333c = getIntersects(onClickPosition, scene.children);
  if (_0x55333c.length > 0x0 && _0x55333c[0x0].uv) {
    var _0x4e3f5f = _0x55333c[0x0].uv;
    _0x55333c[0x0].object.material.map.transformUv(_0x4e3f5f);
    getUv = _0x4e3f5f;
    return {
      'x': getRealPosition('x', _0x4e3f5f.x),
      'y': getRealPosition('y', _0x4e3f5f.y)
    };
  }
  return null;
}




function onMouseEvt(_0x50244e) { 
  _0x50244e.preventDefault();
  const _0x72352f = getPositionOnScene(container, _0x50244e);
  if (_0x72352f) {
    const _0x50eaa8 = canvas._offset;
    const _0xeeadcf = new MouseEvent(_0x50244e.type, {
      'clientX': _0x50eaa8.left + _0x72352f.x,
      'clientY': _0x50eaa8.top + _0x72352f.y
    });
    console.log(_0xeeadcf);
    canvas.upperCanvasEl.dispatchEvent(_0xeeadcf);
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCIONES DE OBTENCION DE DATOS ETC, GETXXXXX

function getPositionOnScene(_0x205558, _0x53ea00) {
  console.log(_0x53ea00);
  console.log(scene);
  var _0x2dbfc3 = getMousePosition(container, _0x53ea00.clientX, _0x53ea00.clientY);
  onClickPosition.fromArray(_0x2dbfc3);
  var _0x3f7783 = getIntersects(onClickPosition, scene.children);
  if (_0x3f7783.length > 0x0 && _0x3f7783[0x0].uv) {
    var _0xc43813 = _0x3f7783[0x0].uv;
    _0x3f7783[0x0].object.material.map.transformUv(_0xc43813);
    return {
      'x': getRealPosition('x', _0xc43813.x),
      'y': getRealPosition('y', _0xc43813.y)
    };
  }
  return null;
}

function getRealPosition(_0x257037, _0x14116f) {
  let _0x557377 = _0x257037 === 'x' ? 4.5 : 5.5;
  return Math.round(_0x14116f * 0x200) - _0x557377;
}

var getMousePosition = function (_0x3430ce, _0x5aa9f9, _0x516fdc) {
  var _0x5021f7 = _0x3430ce.getBoundingClientRect();
  return [(_0x5aa9f9 - _0x5021f7.left) / _0x5021f7.width, (_0x516fdc - _0x5021f7.top) / _0x5021f7.height];
};

var getIntersects = function (_0x22e88c, _0x46e71c) {
  mouse.set(_0x22e88c.x * 0x2 - 0x1, -(_0x22e88c.y * 0x2) + 0x1);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(_0x46e71c);
};