<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
</div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/chater-marzougui/Education-Help-Gemini">
    <img src="./assets/logo.png" alt="Logo" height="192">
  </a>
  <a href="https://chater-marzougui.github.io/pdf-ai-viewer">
    <h1 width="35px">PDF AI Viewer
    </h1>
  </a>
  <p align="center">
    A web-based PDF viewer with AI-powered slide analysis and explanation capabilities using Google's Gemini API.
    <br />
    <br />
    <a href="https://chater-marzougui.github.io/pdf-ai-viewer">View Demo</a>
    ·
    <a href="https://github.com/chater-marzougui/Education-Help-Gemini/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/chater-marzougui/Education-Help-Gemini/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#features">Features</a></li>
    <li><a href="#how-it-works">How It Works</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage-guide">Usage Guide</a></li>
    <li><a href="#technical-details">Technical Details</a></li>
    <li><a href="#privacy--security">Privacy & Security</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## Features

- **PDF Viewing**: Open and navigate through PDF documents with intuitive controls
- **AI Analysis**: Get instant explanations of slides and content using Gemini AI
- **Interactive Chat**: Ask questions about the PDF content and receive AI-powered responses
- **Responsive Design**: Works on desktop and mobile devices
- **User-Friendly Controls**: Zoom, pan, navigate, and interact with PDF pages easily

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How It Works

1. **Upload your PDF**: Drag and drop or browse to select a PDF document
2. **Navigate the document**: Use intuitive controls to move through pages, zoom, and pan
3. **Analyze slides**: Click the AI button to get an explanation of the current slide
4. **Ask questions**: Chat with the AI assistant about the content of your document

<div align="center">
  <img src="./assets/screenshot1.png" alt="Screenshot 1" width="80%">
</div>
<br />
<div align="center">
  <img src="./assets/screenshot2.png" alt="Screenshot 2" width="80%">
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google AI Studio API key (for Gemini API access)

### Setup Instructions

#### 1. Get a Google AI Studio API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create or sign in to your Google account
3. Generate a new API key
4. Copy the API key (it starts with "AIza...")

#### 2. Launch the Application

##### Option A: Using the hosted version
1. Navigate to [PDF AI Viewer](https://chater-marzougui.github.io/pdf-ai-viewer)
2. Enter your Google AI Studio API key when prompted
3. Upload your PDF and start exploring!

##### Option B: Local installation
1. Clone this repository: `git clone https://github.com/chater-marzougui/Education-Help-Gemini.git`
2. Navigate to the project directory: `cd pdf-ai-viewer`
3. Open `index.html` in your browser
4. Enter your Google AI Studio API key
5. Upload your PDF and start exploring!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage Guide

### PDF Navigation

- **Previous/Next Page**: Click the arrow buttons or use keyboard arrow keys
- **Zoom In/Out**: Use the zoom buttons or Ctrl+/- keys
- **Fit to Width**: Click the width adjustment button
- **Pan**: Click and drag to move around the page

### AI Features

- **Analyze Current Slide**: Click the robot icon to get an explanation of the current page
- **Ask Questions**: Type your question in the chat box and press Enter
- **Clear Chat**: Click the trash icon to start a new conversation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering
- Integrates with Google's Gemini 2.0 Flash API for AI capabilities
- Responsive design suitable for desktop and mobile use

### Project Structure

```
pdf-ai-viewer/
├── index.html      
├── viewer.html
├── assets/     
│   ├── logo.png
│   ├── screenshot1.png
│   ├── screenshot2.png
├── static/
│   └── home.css
│   └── viewer.css
│   └── home.js
│   └── viewer.js
├── LICENSE
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Privacy & Security

- Your PDF files are processed completely in your browser and are not uploaded to any server
- Your API key is stored locally in your browser's localStorage
- No data is collected or shared with third parties

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Limitations

- Large PDFs may impact browser performance
- AI analysis works best with clear, well-structured slides
- Requires an internet connection for AI functionality

## Troubleshooting

**Issue**: API key not being accepted
**Solution**: Verify your key is correct and has permissions for Gemini 2.0 Flash

**Issue**: PDF fails to load
**Solution**: Ensure your PDF is not corrupted and try a different PDF to test

**Issue**: Slow performance with large PDFs
**Solution**: Try a smaller PDF or reduce the zoom level

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

- Chater Marzougui - [@Chater-marzougui](linkedin-url) - chater.mrezgui2002@gmail.com <br/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) for the PDF rendering capabilities
- [Google's Gemini API](https://ai.google.dev/) for the AI functionality
- [Marked.js](https://marked.js.org/) for markdown rendering in the chat

[contributors-shield]: https://img.shields.io/github/contributors/chater-marzougui/Education-Help-Gemini.svg?style=for-the-badge
[contributors-url]: https://github.com/chater-marzougui/Education-Help-Gemini/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/chater-marzougui/Education-Help-Gemini.svg?style=for-the-badge
[forks-url]: https://github.com/chater-marzougui/Education-Help-Gemini/network/members
[stars-shield]: https://img.shields.io/github/stars/chater-marzougui/Education-Help-Gemini.svg?style=for-the-badge
[stars-url]: https://github.com/chater-marzougui/Education-Help-Gemini/stargazers
[issues-shield]: https://img.shields.io/github/issues/chater-marzougui/Education-Help-Gemini.svg?style=for-the-badge
[issues-url]: https://github.com/chater-marzougui/Education-Help-Gemini/issues
[license-shield]: https://img.shields.io/github/license/chater-marzougui/Education-Help-Gemini.svg?style=for-the-badge
[license-url]: https://github.com/chater-marzougui/Education-Help-Gemini/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/chater-marzougui-342125299