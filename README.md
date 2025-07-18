# Microsoft 365 Agent SDK React Application

A React application for testing and interacting with Microsoft 365 Copilot Studio agents using the Microsoft Agent SDK.

## ✨ Features

- **🤖 Agent Integration**: Direct connection to Microsoft Copilot Studio agents
- **🔐 Enterprise Authentication**: MSAL-based Entra ID authentication with secure token management
- **📱 Responsive Design**: Modern, mobile-friendly interface with adaptive card rendering
- **🎨 Adaptive Cards**: Rich card rendering with interactive elements and formatting
- **📊 Metadata Display**: Detailed response information and debugging capabilities
- **🔄 Conversation History**: Persistent conversation tracking with timestamps and metadata
- **⚡ Real-time Responses**: Instant message delivery with comprehensive error handling with enterprise-grade security
- **🎯 Suggested Actions**: Interactive buttons for quick response options

## 🎬 Demo

Here's a demonstration of the Microsoft 365 Agent SDK in action:

![Agent SDK Demo](demo.gif)

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

### Step 1: Create Agent

1. **Navigate to Copilot Studio**

   - Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com/)
   - Sign in with your organizational account

2. **Create New Agent**
   - Click **"Create"** → **"New agent"**
   - Configure your agent with topics and responses
   - **Publish** your agent when ready

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
git clone https://github.com/patilravikiran/Microsoft-365-Agent-SDK-Test.git
cd Microsoft-365-Agent-SDK-Test
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
| **Client ID**      | Application ID from Entra ID       | `abcdefgh-1234-5678-90ab-cdefghijklmn` |
| **Tenant ID**      | Directory ID from Entra ID         | `12345678-abcd-efgh-ijkl-mnopqrstuvwx` |
| **Bot Identifier** | Schema Name from Copilot Studio    | `my_agent_schema`                      |
| **Environment ID** | Environment ID from Copilot Studio | `abcdefgh-5678-5678-abcd-cdefghijkl`   |

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

| Package                 | Version | Notes             |
| ----------------------- | ------- | ----------------- |
| @microsoft/msal-browser | ^3.28.0 | Required for auth |
| @microsoft/agents       | ^0.1.1  | Core SDK          |
| adaptivecards           | ^3.0.5  | Card rendering    |

## 🔧 Troubleshooting

### Common Configuration Issues

1. **Popup blocked**: Allow popups in browser settings
2. **Permissions denied**: Ensure API permissions are granted in Entra ID
3. **Agent not found**: Verify Schema Name and Environment ID
4. **CORS errors**: Check redirect URI configuration in Entra ID app

### Authentication Issues

**Error**: "ClientId and TenantId are required"

- **Solution**: Verify configuration values are entered correctly
- **Check**: Entra ID app registration redirect URI is `http://localhost:3000`

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

### Debug Steps

1. Check browser console for authentication flow errors
2. Verify Entra ID app permissions are properly granted
3. Test agent separately in Copilot Studio interface
4. Ensure redirect URI matches exactly (including protocol and port)

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
```

## 📚 Additional Resources

- **[Microsoft Agent SDK Documentation](https://github.com/microsoft/Agents)**
- **[Copilot Studio Documentation](https://docs.microsoft.com/en-us/microsoft-copilot-studio)**
- **[Entra ID App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)**
- **[Power Platform API Permissions Guide](https://learn.microsoft.com/en-us/power-platform/admin/programmability-authentication-v2#step-2-configure-api-permissions)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔧 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **MSAL** - Microsoft Entra ID authentication
- **Adaptive Cards** - Rich card rendering

**Happy coding with Microsoft 365 Agent SDK! 🚀**
