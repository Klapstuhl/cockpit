# Cockpit unit test container

This container has all build dependencies and toolchains (GCC and clang) that
we want to exercise Cockpit with, mostly for `make distcheck` and `make
check-memory`. This container runs on [GitHub](.github/workflows/unit-tests.yml),
but can be easily run locally too.

It assumes that the Cockpit source git checkout is available in `/source`. It
will not modify that directory or take uncommitted changes into account, but it
will re-use an already existing `node_modules/` directory.

The scripts can use either podman (preferred) or docker. If you use docker, you
need to run all commands as root. With podman the containers work as either user
or root.

## Building

The `build` script will build the `cockpit/unit-tests` and
`cockpit/unit-tests:i386` containers. Call it with an architecture to only
build one variant, e.g. `build i386`.

## Running tests

You need to disable SELinux with `sudo setenforce 0` for this. There is no
other way for the container to access the files in your build tree (do *not*
use the `--volume` `:Z` option, as that will destroy the file labels on the
host).

Tests in that container get started with the `start` script.  By default, this
script runs the unit tests on amd64.  The script accepts a number of arguments
to modify its behaviour:

 - `CC=othercc` to set the `CC` environment variable inside the container (ie:
   to build with a different compiler)
 - `:tag` to specify a different tag to use for the `cockpit/unit-tests` image
   (eg: `i386`)
 - `shell` to specify that an interactive shell should be launched instead of
   running the unit tests

Some examples:

    $ ./start           # run the unit tests on amd64

    $ ./start CC=clang  # run the unit tests on amd64, compiled with clang

    $ ./start :i386     # run the unit tests on i386

## Debugging tests

For interactive debugging, run a shell in the container:

    $ ./start shell     # start an interactive shell in default container

You will find the cockpit source tree (from the host) mounted at `/source` in
the container.

`/source/containers/unit-tests/run.sh` will start the builds and test run, then
you can investigate in the build tree at `/tmp/source/`.

`/source/containers/unit-tests/run.sh` also includes a `--build` argument which
will checkout and build the source, but not run any tests.

You can also attach to another container using the provided `exec` script.  For example:

    $ ./exec uname -a   # run a command as the "builder" user

    $ ./exec --root     # start a shell as root

## More Info

 * [Cockpit Project](https://cockpit-project.org)
 * [Cockpit Development](https://github.com/cockpit-project/cockpit)
