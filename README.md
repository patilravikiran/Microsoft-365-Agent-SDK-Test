# Micros## 🎥 Demo

### 🎬 Animated Demo (Coming Soon)
We're working on creating an animated GIF demo. In the meantime, you can:

**[📥 Download Full Demo Video](./demo_video.mp4)** (30MB) - Complete walkthrough showing:
- ⚙️ Configuration setup with Azure and Copilot Studio credentials
- 🔐 Authentication flow with Microsoft Entra ID
- 💬 Real-time messaging with Copilot Studio agents
- 📱 Responsive interface and conversation history
- 🎯 Suggested actions and adaptive cards

### 📸 Application Screenshots

#### Main Interface
![Main Interface](https://via.placeholder.com/800x600/f8f9fa/343a40?text=Main+Interface+Screenshot+Here)

#### Configuration Modal
![Configuration Modal](https://via.placeholder.com/600x400/667eea/ffffff?text=Configuration+Modal+Screenshot+Here)

#### Chat Interface in Action
![Chat Interface](https://via.placeholder.com/800x500/11998e/ffffff?text=Chat+Interface+Screenshot+Here)

### 🔧 How to Convert Video to GIF (Optional)

If you want to create a GIF from the video, you can use these online tools:
1. **[Convertio](https://convertio.co/mp4-gif/)** - Free online MP4 to GIF converter
2. **[CloudConvert](https://cloudconvert.com/mp4-to-gif)** - Advanced conversion options
3. **[EZGIF](https://ezgif.com/video-to-gif)** - Simple video to GIF converter

**Recommended settings for GitHub:**
- Duration: 30-60 seconds (highlight key features)
- Size: 800px width maximum
- Frame rate: 10-15 fps
- File size: Under 10MB for better loading

> **Note**: Replace the placeholder images above with actual screenshots of your application for better visualization.ent SDK React Application

A React application for testing and interacting with Microsoft 365 Copilot Studio agents using the official Microsoft Agent SDK.

## 📖 Overview

This React application provides a modern interface for communicating with Microsoft Copilot Studio agents. Built with TypeScript and styled-components, it offers real-time messaging, adaptive card rendering, and comprehensive error handling with enterprise-grade authentication.

## � Demo Video

Watch the application in action:

https://github.com/user-attachments/assets/your-video-asset-id

> **Note**: To add your video to this README, you'll need to:
>
> 1. Upload the video file (`C:\Users\ravikpatil\Desktop\Agent SDK\AgentSDK_Modified.mp4`) to your GitHub repository
> 2. Or upload it as an asset in a GitHub issue/PR and copy the generated URL
> 3. Replace the placeholder URL above with the actual video URL

## �🌟 Features

- **🔐 Enterprise Authentication**: MSAL-based Entra ID authentication with secure token management
- **💬 Real-Time Messaging**: Direct communication with Copilot Studio agents using official Agent SDK
- **🎨 Adaptive Cards**: Full support for Microsoft Adaptive Cards rendering and interactions
- **🔄 Conversation History**: Persistent conversation tracking with timestamps
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
   - Select **Microsoft Entra ID** → **Manage** → **App registrations**

2. **Create New Registration**

   - Click **"New registration"**
   - **Name**: `Copilot Studio Client App(Name can be anything)`
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

### Step 3: Configure Authentication

1. **Go to Authentication**
   - Select **"Authentication"** in the left menu
   - Enable **"Access tokens"** and **"ID tokens"**
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
cd <Your Folder>
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

## 📦 Version Compatibility

| Package                                | Version | Notes             |
| -------------------------------------- | ------- | ----------------- |
| @azure/msal-browser                    | ^3.28.0 | Required for auth |
| @microsoft/agents-copilotstudio-client | ^0.1.1  | Core SDK          |
| adaptivecards                          | ^3.0.5  | Card rendering    |
| React                                  | ^18.2.0 | Hooks required    |

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Happy coding with Microsoft 365 Agent SDK! 🚀**
