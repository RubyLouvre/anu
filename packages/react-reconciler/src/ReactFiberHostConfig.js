/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'shared/invariant';

// We expect that our Rollup, Jest, and Flow configurations
// always shim this module with the corresponding host config
// (either provided by a renderer, or a generic shim for npm).
//
// We should never resolve to this file, but it exists to make
// sure that if we *do* accidentally break the configuration,
// the failure isn't silent.
export function getPublicInstance() { }
export function cancelTimeout() { }
export function scheduleTimeout() { }
export function prepareForCommit() { }
export function resetAfterCommit() { }
export function getCurrentTime() { }

getCurrentTime
//getCurrentTime
export var noTimeout = 0;
//invariant(false, 'This module must be shimmed by a specific renderer.');
