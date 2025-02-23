# PHP Legacy Refactor

![PHP Legacy Refactor](https://img.shields.io/badge/PHP-legacy--refactor-blue)  
A **VS Code extension** and **CLI tool** that scans PHP projects for **deprecated functions** and suggests modern alternatives.  

🚀 **Easily identify and refactor outdated PHP code** to improve compatibility with the latest PHP versions.  

🔓 **This is an open-source project** – everyone is welcome to contribute, improve, and expand its functionality!  

---

## 📺 Demo Video

🎥 ![Demo GIF](https://raw.githubusercontent.com/tomastt123/php-legacy-refactor/main/assets/videos/demo.gif)
_A short video demonstrating how the tool works in VS Code and CLI mode._

---

## 🖼️ Screenshots

### **CLI Output Example**
![CLI Example](https://raw.githubusercontent.com/tomastt123/php-legacy-refactor/main/assets/screenshots/Testphoto1.jpg)  
![CLI Example](https://raw.githubusercontent.com/tomastt123/php-legacy-refactor/main/assets/screenshots/Testphoto3.jpg)

### **VS Code Extension in Action**
![VS Code Extension](https://raw.githubusercontent.com/tomastt123/php-legacy-refactor/main/assets/screenshots/Testphoto2.jpg)  
_A screenshot showing deprecated functions highlighted in VS Code._

---

## 🌟 Features

✅ Detects deprecated PHP functions in your project.  
✅ Suggests modern replacements for outdated functions.  
✅ Works as a **CLI tool** and a **VS Code extension**.  
✅ Provides **quick fixes** in VS Code for seamless refactoring.  
✅ Uses an external `deprecatedMappings.json` for easy updates.  
✅ **Fully customizable** – modify `deprecatedMappings.json` to tailor replacements to your needs!  
✅ **Open-source** – contribute to the project and help improve it!  

---

## 📦 Installation

### 1️. Clone the Repository

```sh
git clone https://github.com/yourusername/php-legacy-refactor.git
cd php-legacy-refactor
```

### 2. ⚙️ Customizing the Deprecated Functions List

The deprecatedMappings.json file contains all deprecated functions and their suggested replacements. You can edit this file to:

Add new deprecated functions
Modify replacements to fit your coding style
Remove any functions you don't want flagged
Example snippet from deprecatedMappings.json:

{
    "each": "foreach",
    "split": "explode",
    "join": "implode",
    "ereg": "preg_match"
}

📌 Simply update this file, and the CLI tool & VS Code extension will use your custom mappings. 


### 3. 🛠️ Contributing

This project is open-source, and contributions are welcome!

Fork the repository
Create a new branch (feature-new-check or bugfix-fix-xyz)
Make your changes and commit
Submit a pull request
Any contributions, from bug reports to feature improvements, are appreciated!


### 4. 📜 License
This project is licensed under the MIT License – you're free to use, modify, and distribute it.

### 📌 If you find this tool useful, give it a ⭐ on GitHub!
