# Microsoft 365 Agent SDK React Application

A sophisticated React application for testing and interacting with Microsoft 365 Copilot Studio agents using the official Microsoft Agent SDK.

## 📖 Overview

This React application provides a modern interface for communicating with Microsoft Copilot Studio agents. Built with TypeScript and styled-components, it offers real-time messaging, adaptive card rendering, and comprehensive error handling with enterprise-grade authentication.

## 🌟 Features

- **🔐 Enterprise Authentication**: MSAL-based Entra ID authentication with secure token management
- **💬 Real-Time Messaging**: Direct communication with Copilot Studio agents using official SDK
- **🎨 Adaptive Cards**: Full support for Microsoft Adaptive Cards rendering and interactions
- **⚙️ Interactive Configuration**: Modal-based configuration with real-time validation
- **📱 Responsive Design**: Modern UI with 3-column layout optimized for all screen sizes
- **🔄 Conversation History**: Persistent conversation tracking with timestamps
- **⚡ Error Handling**: Comprehensive error management with user-friendly popups
- **🎯 Suggested Actions**: Interactive buttons for quick response options
- **📊 Metadata Display**: Detailed response information and debugging capabilities

## 📋 Prerequisites

### System Requirements

- **Node.js** version 20 or higher ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Modern web browser** with ES2020+ support

### Microsoft Services Setup

1. **Azure Active Directory** tenant with admin access
2. **Microsoft Copilot Studio** access
3. **Power Platform** environment

## 🔧 Azure Active Directory Setup

### Step 1: Create App Registration

1. **Navigate to Azure Portal**

   - Go to [portal.azure.com](https://portal.azure.com/)
   - Select **Azure Active Directory** → **App registrations**

2. **Create New Registration**

   - Click **"New registration"**
   - **Name**: `Copilot Studio Client App`
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**:
     - Platform: **Public client/native (mobile & desktop)**
     - URI: `http://localhost:3000`
   - Click **"Register"**

3. **Record Configuration Values**
   From the **Overview** page, copy:
   - **Application (client) ID** - You'll need this for `clientId`
   - **Directory (tenant) ID** - You'll need this for `tenantId`

### Step 2: Configure API Permissions

1. **Navigate to API Permissions**

   - In your app registration, go to **"API permissions"**
   - Click **"Add a permission"**

2. **Add Power Platform API Permission**

   - Click **"APIs my organization uses"** tab
   - Search for **"Power Platform API"**
   - Select **"Delegated permissions"**
   - Check **"CopilotStudio.Copilots.Invoke"**
   - Click **"Add permissions"**

3. **Grant Admin Consent** (Optional but recommended)
   - Click **"Grant admin consent for [your organization]"**

> **Note**: If you don't see "Power Platform API", follow the [Power Platform API Authentication guide](https://learn.microsoft.com/power-platform/admin/programmability-authentication-v2#step-2-configure-api-permissions) to add it to your tenant.

### Step 3: Configure Authentication

1. **Go to Authentication**
   - Select **"Authentication"** in the left menu
   - Under **"Advanced settings"**, enable:
     - ☑️ **"Allow public client flows"**
   - Click **"Save"**

## 🤖 Copilot Studio Setup

### Step 1: Create Your Agent

1. **Access Copilot Studio**

   - Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com/)
   - Sign in with your organizational account

2. **Create New Agent**
   - Click **"Create"** → **"New agent"**
   - Configure your agent with topics and responses
   - **Publish** your agent when ready
   - Navigate to Settings & Security and Update Authentication to **Authenticate with Microsoft**

### Step 2: Get Agent Configuration

1. **Navigate to Agent Settings**

   - Open your published agent
   - Go to **"Settings"** → **"Advanced"** → **"Metadata"**

2. **Copy Required Values**
   - **Schema name** - You'll need this for `botIdentifier`
   - **Environment Id** - You'll need this for `environmentId`

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd d:\ReactApp\AgentSDK
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### 3. Configure Your Agent

1. **Click "⚙️ Update Agent Configuration"** in the application
2. **Enter your Azure and Copilot Studio values**:

   | Field              | Description                        | Example                                |
   | ------------------ | ---------------------------------- | -------------------------------------- |
   | **Client ID**      | Application (client) ID from Azure | `12345678-1234-1234-1234-123456789012` |
   | **Tenant ID**      | Directory (tenant) ID from Azure   | `87654321-4321-4321-4321-210987654321` |
   | **Bot Identifier** | Schema name from Copilot Studio    | `cr6f2_copilotStudioAgent`             |
   | **Environment ID** | Environment ID from Copilot Studio | `abcdefgh-5678-5678-5678-abcdefghijkl` |

3. **Click "Save Configuration"**

### 4. Test Your Connection

1. **Send a test message** like "Hello" or "Help"
2. **Authenticate** when prompted (first-time only)
3. **View the response** from your Copilot Studio agent

## 📁 Project Structure

```
src/
├── components/
│   ├── AgentInterface.tsx      # Main chat interface
│   ├── ConfigurationForm.tsx   # Settings modal
│   ├── MessageInterface.tsx    # Message input component
│   ├── ResponseDisplay.tsx     # Response rendering
│   ├── AdaptiveCardRenderer.tsx # Adaptive cards support
│   ├── Modal.tsx              # Modal component
│   └── Header.tsx             # Application header
├── services/
│   └── agentService.ts        # Microsoft Agent SDK integration
├── types/
│   └── agent.ts              # TypeScript definitions
└── App.tsx                   # Main application component
```

## ⚙️ Configuration

All configuration is done through the UI - no environment files needed!

### Required Values:

| Field          | Where to Find                                      | Format |
| -------------- | -------------------------------------------------- | ------ |
| Client ID      | Azure Portal → App Registrations → Overview        | GUID   |
| Tenant ID      | Azure Portal → Overview → Tenant ID                | GUID   |
| Bot Identifier | Copilot Studio → Settings → Metadata → Schema Name | String |
| Environment ID | Power Platform Admin Center → Environments         | GUID   |

### Quick Setup:

1. Click "⚙️ Update Agent Configuration" in the app
2. Enter your values
3. Click "Update Configuration"
4. Send a test message

### Authentication Method

This application uses **MSAL (Microsoft Authentication Library)** for secure browser-based authentication with **UI-based configuration** exclusively:

- ✅ **No environment files needed** - All configuration through UI
- ✅ **No client secrets required** in the frontend
- ✅ **Secure popup/redirect authentication** flow
- ✅ **Automatic token management** and renewal
- ✅ **Permission-based access** to Copilot Studio

### Entra ID App Registration Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Create new registration:
   - **Name**: "Agent SDK React App"
   - **Platform**: Single-page application (SPA)
   - **Redirect URI**: `http://localhost:3000` (for development)
4. Note the **Application (client) ID** and **Directory (tenant) ID**
5. Go to **API permissions**:
   - Add permission > APIs my organization uses
   - Search for "Power Platform API"
   - Select **Delegated permissions** > **CopilotStudio** > **CopilotStudio.Copilots.Invoke**
   - Click "Add permissions"
   - (Optional) Grant admin consent

### Copilot Studio Agent Setup

1. Go to [Copilot Studio](https://copilotstudio.microsoft.com)
2. Create or select your agent
3. Publish the agent
4. Go to **Settings** > **Advanced** > **Metadata**
5. Copy the **Schema name** (this is your Bot Identifier)
6. Note the **Environment ID** from the URL or Power Platform admin center

### Security Features

- **No secrets in frontend**: MSAL handles secure authentication
- **Popup authentication**: User signs in via Microsoft popup
- **Token management**: Automatic token refresh and storage
- **Session storage**: Tokens stored securely in browser session
- **Permission-based**: Uses delegated permissions only

### Production Deployment

For production environments:

1. **Update Entra ID app**:

   - Add production redirect URIs
   - Update CORS settings if needed

2. **Environment configuration**:

   - Use production Environment IDs
   - Configure production tenant settings

3. **No additional secrets required**: Same MSAL flow works in production

### Required NPM Packages

The following packages are included in the project dependencies:

```json
{
  "@microsoft/agents-copilotstudio-client": "^0.6.11",
  "@azure/msal-browser": "^4.15.0",
  "adaptivecards": "^3.0.5",
  "react": "^18.2.0",
  "styled-components": "^6.1.0"
}
```

## 📦 Version Compatibility

| Package                                | Version | Notes             |
| -------------------------------------- | ------- | ----------------- |
| @azure/msal-browser                    | ^3.28.0 | Required for auth |
| @microsoft/agents-copilotstudio-client | ^0.1.1  | Core SDK          |
| adaptivecards                          | ^3.0.5  | Card rendering    |
| React                                  | ^18.2.0 | Hooks required    |

### Advanced Features

- **Mock Mode**: Test UI without real API calls
- **Conversation History**: Automatic conversation tracking
- **Error Recovery**: Automatic retry on transient failures
- **Token Caching**: Secure token storage in localStorage

## 🎨 UI Features

### Modern Design Elements

- **Glass morphism effects** with backdrop blur
- **Gradient backgrounds** and smooth animations
- **Responsive grid layout** (3-column desktop, adaptive mobile)
- **Custom SVG icons** for user and agent avatars
- **Interactive buttons** with hover effects

### Accessibility

- **Keyboard navigation** support
- **Screen reader** compatible
- **High contrast** mode support
- **Focus management** for modals

## 🔍 Troubleshooting

### Authentication Issues

**Error**: "ClientId and TenantId are required"

- **Solution**: Ensure all configuration fields are filled correctly

**Error**: "Interactive login failed"

- **Solution**: Check Azure app registration redirect URI is `http://localhost:3000`

**Error**: "Power Platform API not found"

- **Solution**: Follow the [Power Platform API setup guide](https://learn.microsoft.com/power-platform/admin/programmability-authentication-v2#step-2-configure-api-permissions)

### Common Configuration Issues

1. **Popup blocked**: Allow popups in browser settings
2. **Permissions denied**: Ensure API permissions are granted in Entra ID
3. **Agent not found**: Verify Schema Name and Environment ID
4. **CORS errors**: Check redirect URI configuration in Entra ID app

### Debug Steps

1. Check browser console for authentication flow errors
2. Verify Entra ID app permissions are properly granted
3. Test agent separately in Copilot Studio interface
4. Ensure redirect URI matches exactly (including protocol and port)

### Agent Connection Issues

**Error**: "Failed to get conversation ID"

- **Solution**: Verify bot identifier and environment ID are correct
- **Check**: Agent is published in Copilot Studio

**Error**: "Configuration invalid"

- **Solution**: Ensure all GUIDs are properly formatted
- **Verify**: Values are copied exactly from Azure/Copilot Studio

### Network Issues

**Error**: "Network request failed"

- **Solution**: Check internet connection and firewall settings
- **Verify**: No corporate proxy blocking Microsoft APIs

## 🔒 Security Considerations

- **Never commit** configuration values to source control
- **Use environment-specific** configurations for production
- **Enable MFA** for all admin accounts
- **Review permissions** regularly in Azure AD
- **Monitor API usage** through Azure Portal

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run lint       # Run code linting
npm run type-check # TypeScript type checking
```

### Tech Stack

- **React 18.2.0** - Modern React with hooks
- **TypeScript** - Type safety and developer experience
- **Styled Components** - CSS-in-JS styling solution
- **Microsoft Agent SDK** - Official Copilot Studio client
- **MSAL Browser** - Entra ID authentication
- **Adaptive Cards** - Rich card rendering

## 📚 Additional Resources

- **[Microsoft Agent SDK Documentation](https://github.com/microsoft/Agents)**
- **[Copilot Studio Documentation](https://docs.microsoft.com/en-us/microsoft-copilot-studio/)**
- **[Entra ID App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)**
- **[Power Platform API Authentication](https://learn.microsoft.com/power-platform/admin/programmability-authentication-v2)**
- **[Adaptive Cards Schema](https://adaptivecards.io/explorer/)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Microsoft Q&A**: [Power Platform Community](https://docs.microsoft.com/en-us/answers/topics/power-platform.html)
- **Documentation**: [Microsoft Learn](https://docs.microsoft.com/en-us/learn/)

# Start the development server

npm start

```

The application will open in your browser at `http://localhost:3000`.

### 2. Load Sample Configuration

Click the "Load Sample Data" button to populate the form with example values, then replace them with your actual configuration.

### 3. Send Test Messages

Use the pre-defined quick actions or type your own message to test the agent.

## 🔧 Detailed Setup Guide

### Step 1: Azure Active Directory App Registration

1. **Navigate to Azure Portal**

   - Go to [Azure Portal](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Create App Registration**

   - Go to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Fill in the details:
     - **Name**: "Agent SDK React App" (or your preferred name)
     - **Supported account types**: Choose based on your needs
     - **Redirect URI**: `http://localhost:3000` (for development)

3. **Note Down Important Values**

   - **Application (client) ID**: Copy this value
   - **Directory (tenant) ID**: Copy this value from the Overview page

4. **Configure API Permissions**

   - Go to "API permissions"
   - Add permissions for Microsoft Graph or your specific APIs
   - Grant admin consent if required

5. **Create Client Secret** (if needed)
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Set expiration and save the secret value securely

### Step 2: Copilot Studio Bot Setup

1. **Access Copilot Studio**

   - Go to [Copilot Studio](https://copilotstudio.microsoft.com)
   - Sign in with your organizational account

2. **Create a New Bot**

   - Click "Create a chatbot"
   - Choose "Skip to configuration"
   - Give your bot a name and description

3. **Configure Bot Settings**

   - Go to bot settings
   - Note down the **Bot ID** from the bot details
   - Configure any required topics and responses

4. **Publish Your Bot**
   - Click "Publish" to make your bot available
   - Wait for publishing to complete

### Step 3: Power Platform Environment

1. **Access Power Platform Admin Center**

   - Go to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
   - Sign in with admin credentials

2. **Find Your Environment**
   - Navigate to "Environments"
   - Find the environment where your bot is deployed
   - Copy the **Environment ID** from the environment details

### Step 4: Configure the React Application

1. **Open the Application**

   - Start the React app with `npm start`
   - Navigate to `http://localhost:3000`

2. **Fill Configuration Form**

   - **Client ID**: Paste your Entra ID Application ID
   - **Tenant ID**: Paste your Entra ID Directory ID
   - **Bot Identifier**: Enter your Copilot Studio Bot ID
   - **Environment ID**: Enter your Power Platform Environment ID

3. **Test the Configuration**
   - Click "Update Configuration"
   - Send a test message using the quick actions

## 🛠️ Application Structure

```

src/
├── components/
│ ├── AgentInterface.tsx # Main interface component
│ ├── ConfigurationForm.tsx # Configuration form
│ ├── Header.tsx # Application header
│ ├── MessageInterface.tsx # Message input interface
│ └── ResponseDisplay.tsx # Response display component
├── services/
│ └── agentService.ts # Agent service logic
├── types/
│ └── agent.ts # TypeScript type definitions
├── App.tsx # Main application component
├── index.tsx # Application entry point
└── index.css # Global styles

````

## 🔌 Integration with Real Agent SDK

The current implementation uses a mock service for demonstration. To integrate with the real Microsoft 365 Agent SDK:

### 1. Install Additional Packages

```bash
npm install @microsoft/agents-copilotstudio-client @microsoft/agents-activity
````

### 2. Update Agent Service

Replace the mock implementation in `src/services/agentService.ts` with:

```typescript
import { CopilotStudioClient } from "@microsoft/agents-copilotstudio-client";
import { AgentConfig, AgentResponse } from "../types/agent";

export class AgentClient {
  private client: CopilotStudioClient;

  constructor(config: AgentConfig) {
    this.client = new CopilotStudioClient({
      botId: config.botIdentifier,
      environmentId: config.environmentId,
      tenantId: config.tenantId,
      // Add authentication configuration
    });
  }

  async sendMessage(message: string): Promise<AgentResponse> {
    const response = await this.client.sendMessage({
      text: message,
    });

    return {
      id: response.id,
      timestamp: new Date().toISOString(),
      message: response.text || "",
      activities: response.activities,
      metadata: response.metadata,
    };
  }
}
```

### 3. Configure Authentication

Add proper authentication handling based on your Entra ID setup:

```typescript
// Example authentication configuration
const authConfig = {
  clientId: config.clientId,
  authority: `https://login.microsoftonline.com/${config.tenantId}`,
  redirectUri: window.location.origin,
  scopes: ["https://api.powerplatform.com/user_impersonation"],
};
```

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**

   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js version is 20 or higher

2. **Authentication errors**

   - Verify Client ID and Tenant ID are correct
   - Check Entra ID app permissions
   - Ensure bot is published in Copilot Studio

3. **Bot not responding**

   - Verify Bot Identifier is correct
   - Check Environment ID matches the bot's environment
   - Ensure bot is published and active

4. **CORS issues in production**
   - Configure proper CORS settings in your Azure app
   - Update redirect URIs for production domains

### Debug Mode

The application includes comprehensive error handling and user feedback built-in. Additional debugging can be done through browser developer tools.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Azure Static Web Apps

1. Create an Azure Static Web App resource
2. Connect to your GitHub repository
3. Set build configuration:
   - **App location**: `/`
   - **Build location**: `build`
   - **Output location**: `build`

### Environment Variables

For production deployment, set these environment variables:

```
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
REACT_APP_ENVIRONMENT=production
```

## 📚 Additional Resources

- [Microsoft 365 Agent SDK Documentation](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/)
- [Copilot Studio Documentation](https://learn.microsoft.com/en-us/power-virtual-agents/)
- [Azure Active Directory App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Power Platform Admin Center](https://learn.microsoft.com/en-us/power-platform/admin/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 💬 Support

For support and questions:

- Check the troubleshooting section above
- Review Microsoft's official documentation
- Create an issue in the project repository

---

**Happy coding with Microsoft 365 Agent SDK! 🚀**
