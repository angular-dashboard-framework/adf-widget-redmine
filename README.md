# adf-widget-redmine

redmine widget for the [angular-dashboard-framework](https://github.com/sdorra/angular-dashboard-framework).

## Build

The widget is build with the help of [node](https://nodejs.org/), [yarn](https://yarnpkg.com/), [bower](http://bower.io/) and [gulp](http://gulpjs.com/). For a install instruction for node please have a look [here](https://docs.npmjs.com/getting-started/installing-node).

#### Installing bower and gulp

```bash
yarn install -g bower
yarn install -g gulp
```

#### Installing dependencies

```bash
yarn install
bower install
```

#### Build the adf-widget-redmine

```bash
gulp
```

The compiled and optimized files can be found in the dist directory.

#### Excecute the tests 
```
karma start
```

#### Other build goals

Each goal can be used as parameter for the gulp command.

* *clean*: removes the dist folder
* *lint*: checks css and javascript files for common errors
* *serve*: starts an webserver to test the widget

## Development

* Start redmine your local ecosystem with installed redmine/easyredmine.

* At the end of `easyRedmineService.js` and `redmineService.js` remove the comments around
  ```js
  config(function($httpProvider) {
  $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + 'BASE64HERE=';
  })
  ```
  and replace "BASE64HERE" with a base64 hashed combination of `username:password`.
  

* Open a terminal and start an unsafe chrome-tab with (otherwise you will get CORS errors) with this line: 
`google-chrome --disable-web-security --user-data-dir=~/chromeTemp`
<!--- https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome -->

* Navigate to your local ecosystem and log in with the same credentials used in the step before. Then run `gulp serve` and navigate to the displayed URL (likely`localhost:9002`).

Live reload should be enabled.

## Usage

Include the script in your index.html and be sure it is loaded after [angular](https://angularjs.org/) and after the [angular-dashboard-framework](https://github.com/sdorra/angular-dashboard-framework).

```html
<script type="text/javascript" src="path/to/redmine.min.js"></script>
```

Define a dependency for the module:

```javascript
angular.module('sample', ['adf', 'adf.widget.redmine']);
```
