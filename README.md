[Sails](http://sailsjs.org) application


A demo which shows how sails JS and ext JS can work together.

The basic idea is, to put ExtJS and its folder structure in a separate folder (e.g. /gui).
As step number two we have to config sails JS (copy, watch, sync,...) that it only copies the necessary files to .tmp/public (root of the web server)


Therefore we have to change following files:

*) /tasks/config/copy.js
*) /tasks/config/watch.js
*) /tasks/config/sync.js
*) /tasks/register/syncExt.js (create this file)


Changes to copy.js

grunt.config.set('copy', {
		dev: {
			files: [...,
			//add this config
                {
                expand: true,
                cwd: './gui',
                src: ['**/*','!build/**','!ext/**',
                    'ext/ext-all-debug.js',
                    'ext/ext-dev.js',
                    'ext/src/**/*',
                    'ext/packages/ext-theme-neptune/**/*',
                    '!**/sass/**',
                    '!**/.sencha/**'
                ],
                dest: '.tmp/public'
            }
            ]
		}, 
		...
	});
	
	etc.