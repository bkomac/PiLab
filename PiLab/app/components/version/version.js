'use strict';

angular.module('PiLab.version', [
  'PiLab.version.interpolate-filter',
  'PiLab.version.version-directive'
])

.value('version', '0.1');
