// Copyright (c) Roman K
// Distributed under the terms of the Modified BSD License.
import React from 'react'
import { render } from 'react-dom'
import { SampleComponent } from './SampleComponent'

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import * as d3 from 'd3';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

export class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      _view_module_version: ExampleModel.view_module_version,
      value: 'Hello World',
      number: 1,
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ExampleView extends DOMWidgetView {
  render() {
    const element  = React.createElement(
      SampleComponent,
      { model: this.model },
      null
    );
    render(element, this.el)
  }
}

// ----------

const zip = (arr: any[], ...args: any[]): any[] =>
  arr.map((value, idx) => [value, ...args.map(arr => arr[idx])])


export class SimplePlotWithStatsModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SimplePlotWithStatsModel.model_name,
      _model_module: SimplePlotWithStatsModel.model_module,
      _model_module_version: SimplePlotWithStatsModel.model_module_version,
      _view_name: SimplePlotWithStatsModel.view_name,
      _view_module: SimplePlotWithStatsModel.view_module,
      _view_module_version: SimplePlotWithStatsModel.view_module_version,
      x: [],
      y: [],
      alpha: 0,
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'SimplePlotWithStatsModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SimplePlotWithStatsView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SimplePlotWithStatsView extends DOMWidgetView {
  svg: any
  axes: any
  lines: any

  scaleX: any
  scaleY: any

  margin: any
  height: number
  width: number

  slider: any

  render() {
    console.log('M', this.model)
    this.el.classList.add('simple-plot-with-stats-view-widget');

    this.svg = d3.select(this.el)
      .append('svg')

    this.slider = d3.select(this.el)
      .append('input')
      .attr('type', 'range')
      .attr('min', 0)
      .attr('max', 10)
      .property('value', this.model.get('alpha'))
      .on('change', this.onInputChanged.bind(this))

    this.height = 400
    this.width = 800
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    }

    this.axes = this.svg.append('g').attr('class', 'axes')
    this.lines = this.svg.append('g').attr('class', 'lines')

    this.scaleX = d3.scaleLinear()
      .range([this.margin.left, this.width - this.margin.right])

    this.scaleY = d3.scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.top])

    this.svg.attr('viewBox', [0, 0, this.width, this.height].join(' '))

    this.model.on('change:x', this.onModelUpdated, this);
    this.model.on('change:y', this.onModelUpdated, this);
    this.model.on('change:alpha', this.onAlphaChanged, this)

    this.onModelUpdated()
  }

  onModelUpdated() {
    const [x, y] = [this.model.get('x'), this.model.get('y')]

    const msg = `Data: ${x}, ${y}`
    console.log(msg)

    const data = zip(x, y).map(([x, y]: [number, number]) => ({ x, y }))

    // X axis
    this.scaleX
      .domain(d3.extent(data, d => d.x))
  
    const xAxis = (g: any) => g
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.scaleX))

    this.axes
      .selectAll('g.x')
      .data([null])
      .join('g')
      .attr('class', 'x')
      .call(xAxis)

    // Y axis
    const yMax = d3.max(data.map(v => v.y).filter(v => !isNaN(v)))
    this.scaleY.domain([0, yMax])

    const yAxis = (g: any ) => g
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.scaleY))


    this.axes
      .selectAll('g.y')
      .data([null])
      .join('g')
      .attr('class', 'y')
      .call(yAxis)

    type DataPoint = {x: number, y: number}

    // Line
    const line = d3.line<DataPoint>()
      .defined(d => !isNaN(d.y))
      .x(d => this.scaleX(d.x))
      .y(d => this.scaleY(d.y))

    this.lines
      .selectAll('path')
      .data(() => [data])
      .join('path')
      .attr('stroke', 'green')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('d', line)
  }

  onInputChanged() {
    const val = parseInt(this.slider.property('value'))

    this.model.set('alpha', val)
    this.model.save_changes()
    console.log('Input changed: ', val)
  }

  onAlphaChanged() {
    this.slider.property('value', this.model.get('alpha'))
  }
}