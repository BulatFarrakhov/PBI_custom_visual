/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

'use strict';

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel';
import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils';

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class ResponseNodeSettings extends formattingSettings.SimpleCard {
  public maxHeight = new formattingSettings.NumUpDown({
    name: 'maxHeight',
    displayName: 'Max Height',
    value: 100, // default value
  });

  public name: string = 'responseNodeFormatting';
  public displayName: string = 'Response Node Size';
  public show: boolean = true;
  public slices: formattingSettings.Slice[] = [this.maxHeight];
}

class DescribePromptSettings extends FormattingSettingsCard {
  // Existing custom prompt for Describe
  customDescribePrompt = new formattingSettings.TextInput({
    name: 'customDescribePrompt',
    displayName: 'Custom Describe Prompt',
    placeholder: 'Enter custom prompt for Describe',
    value: 'Give me a description for the data below:',
  });

  // New custom prompt for Insights
  customInsightsPrompt = new formattingSettings.TextInput({
    name: 'customInsightsPrompt',
    displayName: 'Custom Insights Prompt',
    placeholder: 'Enter custom prompt for Insights',
    value: 'Give me insights for the data below:',
  });

  name: string = 'describePrompt';
  displayName: string = 'Custom Prompt Settings';
  slices: Array<FormattingSettingsSlice> = [
    this.customDescribePrompt,
    this.customInsightsPrompt,
  ];
}

export class ModelSelectionSettings extends FormattingSettingsCard {
  modelType = new formattingSettings.AutoDropdown({
    name: 'modelType',
    displayName: 'Choose Model',
    value: 'gpt-3.5-turbo', // default to GPT-3
  });

  name: string = 'modelSelection';
  displayName: string = 'Model Selection';
  slices: Array<FormattingSettingsSlice> = [this.modelType];
}
class ButtonTextSettings extends FormattingSettingsCard {
  describeButtonText = new formattingSettings.TextInput({
    name: 'describeButtonText',
    displayName: 'Describe Button Text',
    placeholder: 'Enter text for Describe button',
    value: 'Describe', // Default value
  });
  // New setting for Insights button text
  insightsButtonText = new formattingSettings.TextInput({
    name: 'insightsButtonText',
    displayName: 'Insights Button Text',
    placeholder: 'Enter text for Insights button',
    value: 'Insights', // Default value
  });

  name: string = 'buttonTextSettings';
  displayName: string = "Buttons' Names";
  slices: Array<FormattingSettingsSlice> = [
    this.describeButtonText,
    this.insightsButtonText,
  ];
}

class ButtonVisibilitySettings extends FormattingSettingsCard {
  describeButtonVisible = new formattingSettings.ToggleSwitch({
    name: 'describeButtonVisible',
    displayName: 'Show Describe Button',
    value: true, // Default to visible
  });

  insightsButtonVisible = new formattingSettings.ToggleSwitch({
    name: 'insightsButtonVisible',
    displayName: 'Show Insights Button',
    value: true, // Default to visible
  });

  name: string = 'buttonVisibility';
  displayName: string = 'Buttons Visibility';
  slices: Array<FormattingSettingsSlice> = [
    this.describeButtonVisible,
    this.insightsButtonVisible,
  ];
}
export class ButtonSettings extends formattingSettings.SimpleCard {
  public buttonColor = new formattingSettings.ColorPicker({
    name: 'buttonColor',
    displayName: 'Button Color',
    value: { value: '#4caf50' }, // Updated to match the pattern
  });

  public hoverColor = new formattingSettings.ColorPicker({
    name: 'hoverColor',
    displayName: 'Hover Color',
    value: { value: '#45a049' }, // Updated to match the pattern
  });

  public name: string = 'buttonFormatting';
  public displayName: string = 'Button Color Formatting';
  public show: boolean = true;
  public slices: formattingSettings.Slice[] = [
    this.buttonColor,
    this.hoverColor,
  ];
}

export class UserDetailsSettings extends FormattingSettingsCard {
  public company = new formattingSettings.TextInput({
    name: 'company',
    displayName: 'Company',
    placeholder: 'Your company name eg 160/90',
    value: '', // Default value
  });

  public project = new formattingSettings.TextInput({
    name: 'project',
    displayName: 'Project',
    placeholder: 'Project Name',
    value: '', // Default value
  });

  public email = new formattingSettings.TextInput({
    name: 'email',
    displayName: 'Email',
    placeholder: 'eg bulat.farrakhov@endeavorco.com',
    value: '', // Default value
  });

  // Add these properties
  public name: string = 'userDetails';
  public displayName: string = 'User Details';
  public show: boolean = true;
  public slices: Array<FormattingSettingsSlice> = [
    this.company,
    this.project,
    this.email,
  ];
}

export class VisualSettings extends formattingSettings.Model {
  public responseNodeFormatting: ResponseNodeSettings =
    new ResponseNodeSettings();
  public modelSelection: ModelSelectionSettings = new ModelSelectionSettings();
  public describePrompt: DescribePromptSettings = new DescribePromptSettings(); // adding the describe prompt settings
  public buttonText: ButtonTextSettings = new ButtonTextSettings(); // Add this line
  public buttonVisibility: ButtonVisibilitySettings =
    new ButtonVisibilitySettings(); // Add this line
  public userDetails: UserDetailsSettings = new UserDetailsSettings();
  public buttonFormatting: ButtonSettings = new ButtonSettings();
  public cards: formattingSettings.Cards[] = [
    this.responseNodeFormatting,
    this.modelSelection,
    this.describePrompt, // include the describe prompt settings card
    this.buttonText,
    this.buttonVisibility,
    this.buttonFormatting,
    this.userDetails,
  ]; // Corrected import name
  public apiSettings: ApiSettings = new ApiSettings();
}

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
  defaultColor = new formattingSettings.ColorPicker({
    name: 'defaultColor',
    displayName: 'Default color',
    value: { value: '' },
  });

  showAllDataPoints = new formattingSettings.ToggleSwitch({
    name: 'showAllDataPoints',
    displayName: 'Show all',
    value: true,
  });

  fill = new formattingSettings.ColorPicker({
    name: 'fill',
    displayName: 'Fill',
    value: { value: '' },
  });

  fillRule = new formattingSettings.ColorPicker({
    name: 'fillRule',
    displayName: 'Color saturation',
    value: { value: '' },
  });

  fontSize = new formattingSettings.NumUpDown({
    name: 'fontSize',
    displayName: 'Text Size',
    value: 12,
  });

  name: string = 'dataPoint';
  displayName: string = 'Data colors';
  slices: Array<FormattingSettingsSlice> = [
    this.defaultColor,
    this.showAllDataPoints,
    this.fill,
    this.fillRule,
    this.fontSize,
  ];
}

/**
 * visual settings model class
 *
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
  // Create formatting settings model formatting cards
  dataPointCard = new DataPointCardSettings();

  cards = [this.dataPointCard];
}

export class ApiSettings {
  public tokenEndpoint: string = '';
  public proxyEndpoint: string = '';
  public secretKey: string = '';
}
