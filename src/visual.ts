/*
 *  Power BI Visual CLI
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
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import PrimitiveValue = powerbi.PrimitiveValue;
import './../style/visual.less';
import { VisualSettings } from './settings';
import { FormattingSettingsService } from 'powerbi-visuals-utils-formattingmodel';

export class Visual implements IVisual {
  private target: HTMLElement;
  private landingPage: HTMLElement;
  //private textNode: Text;
  private describeButton: HTMLButtonElement;
  private insightsButton: HTMLButtonElement;
  private cleanedData: string; // Stores the cleaned data
  private responseNode: HTMLElement;
  private loadingIndicator: HTMLElement; // Declare the loading indicator
  private visualSettings: VisualSettings;
  private formattingSettingsService: FormattingSettingsService;

  private createLandingPage() {
    const landingPage = document.createElement('div');
    landingPage.innerHTML = `
        <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 10px;">
            <h2>Welcome to AI Insights Generator</h2>
            <p>This visual can help your users get text generated from AI Models. You can modify the prompt settings to make it even better. Please note that AI models struggle with large amounts of data, so it's always best to explain to your users that limiting data leads to better outputs.</p>
            <p>You can also choose between GPT-3 and GPT-4 models: GPT-4 provides higher context and overall better quality answers, but costs more. Costs are currently handled by Endeavor Analytics.</p>
        
            <p>This text will disappear once you add data !</p>
        </div>
    `;
    landingPage.style.display = 'none'; // Initially hidden
    this.target.appendChild(landingPage);
    this.landingPage = landingPage; // Store it as a class property for later access
  }

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.target = options.element;
    // Create and add the landing page
    this.createLandingPage();
    this.createVisualElements();
    this.formattingSettingsService = new FormattingSettingsService();
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.visualSettings
    );
  }

  private countTokens(text: string): number {
    // Basic tokenization based on spaces and some punctuation
    return text.trim().split(/[\s,.;:!?()]+/).length;
  }

  private createVisualElements() {
    if (document) {
      // Existing elements
      //this.textNode = document.createTextNode("");
      //this.target.appendChild(this.textNode);
      // Disclaimer node
      const disclaimerNode = document.createElement('div');
      disclaimerNode.className = 'disclaimer-box'; // Add class for styling
      disclaimerNode.innerHTML =
        'Powered by AI model. Please ensure the correctness of the answers.';
      this.target.insertBefore(disclaimerNode, this.responseNode); // Insert the disclaimer before the response node
      // Create Describe button
      this.describeButton = document.createElement('button');
      this.describeButton.textContent = 'Describe'; // Default text, will be updated
      this.describeButton.className = 'custom-button'; // Add class for styling
      this.describeButton.addEventListener('click', () =>
        this.onDescribeButtonClick()
      );
      this.target.appendChild(this.describeButton);

      // Create Insights button
      this.insightsButton = document.createElement('button');
      this.insightsButton.textContent = 'Insights'; // Default text, will be updated
      this.insightsButton.className = 'custom-button'; // Add class for styling
      this.insightsButton.addEventListener('click', () =>
        this.onInsightsButtonClick()
      );
      this.target.appendChild(this.insightsButton);

      // Response node (for displaying the response)
      this.responseNode = document.createElement('div');
      this.responseNode.className = 'response-box'; // Add class for styling
      this.target.appendChild(this.responseNode);
      this.responseNode.style.position = 'relative';

      // Loading indicator
      this.loadingIndicator = document.createElement('div');
      this.loadingIndicator.className = 'loading-indicator';
      this.loadingIndicator.style.display = 'none';
      this.target.appendChild(this.loadingIndicator);
    }
  }

  private onDescribeButtonClick(): void {
    this.landingPage.style.display = 'none';
    console.log('Describe button clicked');
    let tokenCount = this.countTokens(this.cleanedData);
    if (tokenCount > 2000) {
      this.responseNode.innerHTML =
        'Cannot process so much data, please use filters to lower it';
      this.loadingIndicator.style.display = 'none'; // Hide loading indicator
      return;
    }
    this.responseNode.innerHTML = '';
    if (this.loadingIndicator.style.display === 'block') {
      this.responseNode.innerHTML =
        'Please wait, processing previous request...';
      return;
    }
    this.loadingIndicator.style.display = 'block'; // Show loading indicator

    // Get the custom prompt from the settings
    const customDescribePrompt =
      this.visualSettings.describePrompt.customDescribePrompt.value;

    const prompt = customDescribePrompt + '\n' + this.cleanedData;
    this.callOpenAiApi(prompt); // Call API
  }

  private onInsightsButtonClick(): void {
    this.landingPage.style.display = 'none';
    console.log('Insights button clicked');
    let tokenCount = this.countTokens(this.cleanedData);
    if (tokenCount > 2000) {
      this.responseNode.innerHTML =
        'Cannot process so much data, please use filters to lower it';
      this.loadingIndicator.style.display = 'none'; // Hide loading indicator
      return;
    }
    this.responseNode.innerHTML = '';
    if (this.loadingIndicator.style.display === 'block') {
      this.responseNode.innerHTML =
        'Please wait, processing previous request...';
      return;
    }
    this.loadingIndicator.style.display = 'block'; // Show loading indicator
    const customInsightsPrompt =
      this.visualSettings.describePrompt.customInsightsPrompt.value;
    const prompt = customInsightsPrompt + '\n' + this.cleanedData;
    this.callOpenAiApi(prompt); // Call API
  }
  private async getJwtToken(): Promise<string> {
    const tokenEndpoint = process.env.TOKEN_ENDPOINT;
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey: process.env.SECRET_KEY }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error obtaining JWT token:', error);
      throw error;
    }
  }

  private async callOpenAiApi(prompt: string): Promise<void> {
    console.log(
      'Initiating call to Azure Function App proxy with prompt:',
      prompt
    );

    // Retrieve the selected model from VisualSettings
    const selectedModel = this.visualSettings.modelSelection.modelType.value;

    // Azure Function App proxy endpoint
    const proxyEndpoint = process.env.PROXY_ENDPOINT;
    try {
      this.loadingIndicator.style.display = 'block'; // Show loading indicator

      // Get JWT token
      const jwtToken = await this.getJwtToken();

      // Extract user details from settings
      const userDetails = this.visualSettings.userDetails;
      const userDetailPayload = {
        company: userDetails.company.value,
        project: userDetails.project.value,
        email: userDetails.email.value,
      };

      // Make the request to the Azure Function App proxy with the JWT token
      const response = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel, // Use the dynamically selected model
          prompt: prompt,
          userDetails: userDetailPayload,
        }),
      });

      console.log('Proxy request sent. Status code:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received response from Azure Function App proxy:', data);
      this.handleApiResponse(data); // Assuming this method processes the response appropriately
    } catch (error) {
      console.error('Error calling Azure Function App proxy:', error);
      this.responseNode.innerHTML = `Error: ${
        error.message || 'An error occurred'
      }`; // Display error message
    } finally {
      this.loadingIndicator.style.display = 'none'; // Hide loading indicator after response or error
    }
  }

  private handleApiResponse(data: any): void {
    console.log('Processing response data:', data);

    // Extract the 'content' from the response
    const content = data.choices[0].message.content;

    // Replace newline characters with HTML <br> tags
    const formattedContent = content.replace(/\n/g, '<br>');

    // Optionally format bold text - assuming bold text is marked like **this**
    // const formattedBold = formattedContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Set the formatted string as inner HTML of the responseNode
    this.responseNode.innerHTML = formattedContent; // or formattedBold if you're formatting bold text
  }
  private applyButtonStyles() {
    // Access button formatting settings
    const buttonColor =
      this.visualSettings.buttonFormatting.buttonColor.value.value;
    const hoverColor =
      this.visualSettings.buttonFormatting.hoverColor.value.value;

    // Set initial button color and add hover effects
    this.setButtonStyle(this.describeButton, buttonColor, hoverColor);
    this.setButtonStyle(this.insightsButton, buttonColor, hoverColor);
  }

  private setButtonStyle(
    button: HTMLButtonElement,
    normalColor: string,
    hoverColor: string
  ) {
    button.style.backgroundColor = normalColor;

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = hoverColor;
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = normalColor;
    });
  }
  public update(options: VisualUpdateOptions) {
    console.log('Visual update', options);

    // Check if there's data
    // Check if there's data
    const hasData =
      options.dataViews &&
      options.dataViews[0] &&
      options.dataViews[0].categorical &&
      options.dataViews[0].categorical.categories &&
      options.dataViews[0].categorical.categories.some(
        (category) => category.values && category.values.length > 0
      );

    if (!hasData) {
      // Show landing page if no data
      this.landingPage.style.display = 'block';
    } else {
      // Hide landing page if data is present
      this.landingPage.style.display = 'none';
    }

    // Toggle landing page based on data availability
    this.landingPage.style.display = hasData ? 'none' : 'block';
    this.visualSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualSettings,
        options.dataViews[0]
      );

    // Apply max height to the response node
    const maxHeight =
      this.visualSettings.responseNodeFormatting.maxHeight.value;
    this.responseNode.style.height = `${maxHeight}px`;

    //this.textNode.textContent = "";

    if (!options.dataViews || !options.dataViews[0]) return;

    let dataView: DataView = options.dataViews[0];
    let dataStringArray: string[] = this.processDataView(dataView);
    this.cleanedData = dataStringArray.join('\n');

    // Count tokens in cleanedData
    let tokenCount = this.countTokens(this.cleanedData);

    // Display token count and warning if necessary
    // if (tokenCount > 2000) {
    //   this.textNode.textContent = `Token count: ${tokenCount}. DO NOT SEND REQUEST (exceeds 2,000 tokens)`;
    // } else {
    //   this.textNode.textContent = `Token count: ${tokenCount}`;
    // }
    // Toggle visibility of Describe button
    this.describeButton.style.display = this.visualSettings.buttonVisibility
      .describeButtonVisible.value
      ? ''
      : 'none';
    // Load all visual settings
    this.visualSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualSettings,
        options.dataViews[0]
      );

    // Apply button formatting settings
    this.applyButtonStyles();
    // Toggle visibility of Insights button
    this.insightsButton.style.display = this.visualSettings.buttonVisibility
      .insightsButtonVisible.value
      ? ''
      : 'none';

    this.describeButton.textContent =
      this.visualSettings.buttonText.describeButtonText.value || 'Describe';
    this.insightsButton.textContent =
      this.visualSettings.buttonText.insightsButtonText.value || 'Insights';

    // Access the user details settings
    const userDetails = this.visualSettings.userDetails;
    const company = userDetails.company.value;
    const project = userDetails.project.value;
    const email = userDetails.email.value;
  }

  private processDataView(dataView: DataView): string[] {
    let dataStringArray: string[] = [];

    if (dataView.categorical) {
      let categories = dataView.categorical.categories;
      let measures = dataView.categorical.values;

      let headers: string[] = categories.map((c) => c.source.displayName);
      measures.forEach((m) => headers.push(m.source.displayName));
      dataStringArray.push(headers.join('\t'));

      for (let i = 0; i < categories[0].values.length; i++) {
        let rowItems: string[] = categories.map((category) =>
          this.formatDataValue(category, i)
        );
        measures.forEach((measure) => {
          rowItems.push(
            measure.values[i] != null ? measure.values[i].toString() : 'N/A'
          );
        });
        dataStringArray.push(rowItems.join('\t'));
      }
    }
    return dataStringArray;
  }

  private formatDataValue(
    category: powerbi.DataViewCategoryColumn,
    index: number
  ): string {
    let value: PrimitiveValue = category.values[index];
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (
      category.source.type.dateTime &&
      (typeof value === 'string' || value instanceof Date)
    ) {
      let date = new Date(value as string);
      return `${('0' + (date.getMonth() + 1)).slice(-2)}/${(
        '0' + date.getDate()
      ).slice(-2)}/${date.getFullYear()}`;
    }
    return value.toString();
  }
}
