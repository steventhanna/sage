# Sage

[![Greenkeeper badge](https://badges.greenkeeper.io/steventhanna/sage.svg)](https://greenkeeper.io/)
Search through images with lots of text by using Tesseract to perform character recognition.

## Purpose
Sometimes I just have too many screenshots full of text, and I am looking for a specific image for reference. Using *Sage*, I can analyze and find the image that most likely fits my query.

## Disclaimer
This does not work perfectly by any means, but it sure is better than nothing.  The text extraction is not always accurate, thus throwing off the search results.  But the more you use *Sage*, the better it will become through constant training.

## Installing

### macOS
1. Download the [Zip File](https://github.com/steventhanna/sage/releases) 
2. Unzip the file
3. Move `Sage.app` to your Applications Folder.

### Windows
1. Download the [Zip File](https://github.com/steventhanna/sage/releases) 
2. Unzip the file
3. Move `Sage.app` to your desired installation location.

### Linux
#### Ubuntu (From PPA)
_Coming soon_

#### Ubuntu (.deb)
1. Download the [.deb file](https://github.com/steventhanna/proton/releases/download/v0.1.0/proton_0.1.0_amd64.deb) (amd64 only -- _more support coming soon_)
    ```
    $: cd ~/Downloads
    $: wget https://github.com/steventhanna/sage/releases/download/v0.1.0/sage_0.1.0_amd64.deb
    ```
2. Install Sage from the .deb file.
    ```
    $: sudo dpkg -i sage_0.1.0_amd64.deb
    ```

#### Linux (Binary)
1. Download and Install the Binary. ([x64](https://github.com/steventhanna/sage/releases/download/v0.1.0/Sage-Linux_0.1.0_x64.tar.gz)) ([ia32](https://github.com/steventhanna/sage/releases/download/v0.1.0/Sage-Linux_0.1.0_ia32.tar.gz))
    ```
    $: cd ~/Download

    # For x64
    $: wget https://github.com/steventhanna/sage/releases/download/v0.1.0/Sage-Linux_0.1.0_x64.tar.gz
    $: tar -xzf Sage-Linux_0.1.0_x64.tar.gz
    $: mkdir /opt/Sage
    $: cd /opt/Sage
    $: mv ~/Downloads/Sage-Linux_0.1.0_x64/* .

    # For ia32
    $: wget https://github.com/steventhanna/proton/releases/download/v0.1.0/Sage-Linux_0.1.0_ia32.tar.g
    $: tar -xzf Sage-Linux_0.1.0_ia32.tar.gz
    $: mkdir /opt/Sage
    $: cd /opt/Sage
    $: mv ~/Downloads/Sage-Linux_0.1.0_ia32/* .
    ```
## Building
1. Clone the repo: `git@github.com:steventhanna/sage.git`
2. CD to the repo
3. Install dependencies: `npm install`

## Usage
1. Run the app by running electron: `electron .`

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout my-new-feature`
3. Commit your changes
4. Submit a pull request

## License
Sage is licensed under the GUN General Public License. Read the license [here](https://github.com/steventhanna/sage/blob/master/LICENSE)