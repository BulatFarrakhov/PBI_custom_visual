# Setup Guide for Power BI Custom Visuals (need IT if running on work pc to install node.js + allow scripting)

## VS Code

### Step 1: Install Node.js and NPM

**Node.js** is a runtime environment for executing JavaScript code outside of a browser, and **NPM (Node Package Manager)** is used to manage JavaScript packages.

- **Download Node.js**: Go to [Node.js official website](https://nodejs.org/en) and download the latest stable version (LTS).
- **Install Node.js**: Run the installer and follow the installation prompts. Ensure it installs NPM as well, which usually comes with Node.js.
- **Verify Installation**: Open VS Code's terminal and type `node -v` and `npm -v` to check if Node.js and NPM are installed correctly.

### Step 2: Install Power BI Visuals Tools

**Power BI Visuals Tools (PBIVIZ)** is a command-line tool that allows you to create and manage Power BI visuals.

- **Install PBIVIZ**: In the VS Code terminal, run `npm install -g powerbi-visuals-tools`.
- **Verify PBIVIZ Installation**: Type `pbiviz -V` to check if it's installed.

### Step 3: Clone the GitHub Repository

- **Clone the Repo**: Use the `git clone [repository URL]` command in VS Code's terminal.
- **Navigate to the Repo Folder**: Use `cd [folder name]` to move into the project directory.

### Step 4: Install Dependencies

- **Install Packages**: In the project directory, run `npm install`. This installs all necessary packages listed in the `package.json` file.

### Step 5: Packaging and Distribution

- **Create a Package**: Once the visual is ready, run `pbiviz package` to create a `.pbiviz` file.

## Power BI Desktop

### Enabling Developer Mode in Power BI

- **Open Power BI Desktop**: Launch the Power BI Desktop application on your computer.
- **Go to Options**: Click on "File" in the top menu bar, then select "Options and settings" and click on "Options".
- **Enable Developer Mode**:
  - In the "Options" window, navigate to the "Preview features" tab.
  - Check the box next to “Developer mode”. This will enable additional developer features.
  - Click "OK" to save changes.
- **Restart Power BI Desktop**: Close and reopen Power BI Desktop for the changes to take effect.

### Importing a Custom Visual

#### From a Local File

If you have a custom visual file (typically with a `.pbiviz` extension), follow these steps:

- **Open a Report**: Open the report where you want to use the custom visual.
- **Import the Custom Visual**:
  - In the Home ribbon, click on the ellipsis (`...`) in the "Visualizations" pane.
  - Select "Import a visual from a file".
  - Navigate to the location of your `.pbiviz` file, select it, and click "Open".
- **Use the Custom Visual**:
  - After importing, the custom visual will appear in your "Visualizations" pane.
  - Click on the custom visual icon to add it to your report.
