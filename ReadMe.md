# Ignore - CLI (Work in progress)

* A fast command line tool for adding .ignore files to your project
    - For example, .gitignore for [git](https://git-scm.com/) repositories, or .dockerignore for [docker](https://www.docker.com/get-started) projects

## Usage

* ignore [-s][--service] [-o][--out] [--local] \<language\>
    - language     : [Required] Specify the language e.g. Python, NodeJs, C++ 
    - --service/-s : [Optional] The service or platform you are working on e.g. Git or Docker
    - --local      : [Optional] Add from your own local .ignore repository
    - --out/-o     : [Optional] Where the .ignore files should be downloaded to e.g. src/ or /path/to/project/src



```bash
# Example 1: Add a .gitignore file for Python project
ignore Python  # Or ignore --service git Python

# Example 2: Add a Python ignore file for a *docker* (specified with option -s or --service) projectt
ignore -s docker Python

# Example 3: Coming soon....
ignore --local MyCustomIgnorTemplate
```

## How it works

* The project is based on the public github repositories that contain a collection of common .ignore files

* The templates are downloaded on-demand from github using *HTTPS*

```bash 
# For example, 
ignore -s docker Dart
# this command will make a Get request to https://raw.githubusercontent.com/github/gitignore/main/Dart.gitignore
# By default the file will be downloaded to the current working directory
```


## List Of Supported platforms

* git    - Get .gitignore files
* Docker - Get .dockerignore files