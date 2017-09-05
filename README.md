# aurelia-resource-generator

A bundle config generator for Aurelia

**This project is in an early stage of development! Things are not finished yet!**

## Motivation

We all felt that pain at some point: You start a new Aurelia + RequireJS project
and sooner or later you want to install your first dependency which needs
to be included in your `aurelia.json` file.

Usually you just fire `au import <package name>` up and everything is right... right?

Well, I had cases where the Aurelia-CLI would not import my package and just
fail with some ambiguous message. This is especially true for scoped packages
(e.g `@user/package`).

## What this does

This application scans the `node_modules` directory in the current working
directory and tries to build a resource list which can be used in your
`aurelia.json` config file.

Be aware that it dependends on an existing
`aurelia.build.resources` entry in the dependency's `package.json` file.

It's not some smart application which analyzes the import statements in your
code. Pretty dumb, but it should do the job.

## Okay, how do I set it up?

Install it locally or globally using npm:

```
$ npm install aurelia-resource-generator
```

You can access the CLI by using the command `au-generate-resources`.
