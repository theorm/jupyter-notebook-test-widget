#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Roman K
# Distributed under the terms of the Modified BSD License.

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'nbextension/static',
        'dest': 'rk_test_widget',
        'require': 'rk_test_widget/extension'
    }]
