'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ProtoBuf = _interopDefault(require('protobufjs'));
var protobufjs_cli_targets_json = require('protobufjs/cli/targets/json');
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

            var root = new ProtoBuf.Root();
			root.loadSync(id);
            var json = JSON.stringify(root);

            return {
                code: ("import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJson(" + json + ");"),
                map: { mappings: '' }
            };
        }
    };
}

module.exports = protobuf;