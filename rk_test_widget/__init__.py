#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Roman K.
# Distributed under the terms of the Modified BSD License.

from .example import ExampleWidget, Smoother
from ._version import __version__, version_info

def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "rk_test_widget"
    }]