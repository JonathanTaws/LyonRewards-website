'use strict';

angular.module('lyonRewards.version', [
  'lyonRewards.version.interpolate-filter',
  'lyonRewards.version.version-directive'
])

.value('version', '0.1');
