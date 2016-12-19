'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ProtoBuf = _interopDefault(require('protobufjs'));
var protobufToJson = _interopDefault(require('protobufjs/cli/targets/json'));
var protobufToStatic = _interopDefault(require('protobufjs/cli/targets/static'));
var rollupPluginutils = require('rollup-pluginutils');

var ext = /\.proto$/;

function protobuf(options) {
    if ( options === void 0 ) options = {};

    var filter = rollupPluginutils.createFilter(options.include, options.exclude);

    return {
        name: 'protobuf',

        transform: function transform(code, id) {
            if (!ext.test(id)) return null;
            if (!filter(id)) return null;
			
			return new Promise(function (resolve, reject) {
				new ProtoBuf.Root().load(id, options, function (err, root) {
					if(err) return reject(err);
					if(options.target == 'static') {
						protobufToStatic(root, options, function (err, code) {
							if(err) return reject(err);
							resolve({
								code: ("import $protobuf from 'protobufjs/runtime';\n" + code + "\nexport default $root;"),
								map: { mappings: '' }
							});
						});
					} else {
						protobufToJson(root, options, function (err, code) {
							if(err) return reject(err);
							resolve({
								code: ("import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJSON(" + json + ");"),
								map: { mappings: '' }
							});
						});
					}
				});
			});
        }
    };
}

module.exports = protobuf;