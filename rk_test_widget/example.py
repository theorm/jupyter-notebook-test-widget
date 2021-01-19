#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Roman K.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode, Float, List, Int, observe
from ._frontend import module_name, module_version
import pandas as pd

class ExampleWidget(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('ExampleModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('ExampleView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = Unicode('Hello World').tag(sync=True)
    number = Float(0).tag(sync=True)

    def __init__(self, number=0, **kwargs):
        super(ExampleWidget, self).__init__(**kwargs)

        # print('*', self.number, self.number.__class__)
        self.number = 0
        # print('*', self.number, self.number.__class__)


class Smoother(DOMWidget):
    _model_name = Unicode('SimplePlotWithStatsModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('SimplePlotWithStatsView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    x = List([]).tag(sync=True)
    y = List([]).tag(sync=True)
    alpha = Int(0).tag(sync=True)

    smoothed_dataframe: pd.DataFrame = None

    def __init__(self, dataframe, x_col='index', y_col='value', **kwargs):
        super(Smoother, self).__init__(**kwargs)

        assert isinstance(dataframe, pd.DataFrame), \
            '"dataframe" argument is expected to be a Pandas DataFrame object.'

        available_columns = ['index'] + dataframe.columns.tolist()

        assert x_col in available_columns, f'Unknown x column "{x_col}". Available columns are: {", ".join(available_columns)}'
        assert y_col in available_columns, f'Unknown y column "{y_col}". Available columns are: {", ".join(available_columns)}'

        self.x_col = x_col
        self.y_col = y_col

        self.dataframe = dataframe
        self.smoothed_dataframe = dataframe.copy(deep=True)

        self.smooth_data()

    @observe('alpha')
    def _observe_alpha(self, change):
        self.smooth_data()

    def smooth_data(self):
        if self.alpha == 0:
            self.smoothed_dataframe[self.y_col] = self.dataframe[self.y_col]
        else:
            self.smoothed_dataframe[self.y_col] = self.dataframe[self.y_col].rolling(self.alpha).mean().values

        self.x = self.smoothed_dataframe.index.tolist() if self.x_col == 'index' else self.smoothed_dataframe[self.x_col].tolist()
        self.y = self.smoothed_dataframe.index.tolist() if self.y_col == 'index' else self.smoothed_dataframe[self.y_col].tolist()

    @property
    def output(self):
        return self.smoothed_dataframe
