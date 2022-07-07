workspace(
    name = "blockheads",
    # tells bazel that node_modules dir is managed by rules_nodejs
    # see: https://bazelbuild.github.io/rules_nodejs/install.html#using-bazel-managed-dependencies
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")

################################################################################
# BAZEL RULE / TOOLCHAIN SETUP
################################################################################

# download `io_bazel_rules_go` up front to ensure all of our other rulesets
# leverage the same version, see related issue:
# https://github.com/bazelbuild/rules_go/issues/2398#issuecomment-597139571
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "d6b2513456fe2229811da7eb67a444be7785f5323c6708b38d851d2b51e54d83",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.30.0/rules_go-v0.30.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.30.0/rules_go-v0.30.0.zip",
    ],
)

#########################################
# GOLANG
#########################################

# set up `io_bazel_rules_go` imported at top of this file
load("@io_bazel_rules_go//go:deps.bzl", "go_download_sdk", "go_register_toolchains", "go_rules_dependencies")

go_download_sdk(
    name = "go_sdk",
    goarch = "amd64",
    goos = "linux",
    version = "1.17.6",
)

# see https://github.com/bazelbuild/rules_go/blob/master/go/extras.rst#id3
load("@io_bazel_rules_go//extras:embed_data_deps.bzl", "go_embed_data_dependencies")

# gazell generates BUILD files for go/protobuf
http_archive(
    name = "bazel_gazelle",
    sha256 = "de69a09dc70417580aabf20a28619bb3ef60d038470c7cf8442fafcf627c21cb",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.24.0/bazel-gazelle-v0.24.0.tar.gz",
    ],
)

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")

go_repository(
    name = "io_k8s_client_go",
    build_file_generation = "on",
    build_file_proto_mode = "disable_global",
    importpath = "k8s.io/client-go",
    sum = "h1:lbE4aB1gTHvYFSwm6eD3OF14NhFDKCejlnsGYlSJe5U=",
    version = "v0.24.0",
)

# only set up dependencies once we have imported everything that could
# possibly be overridden: see "overriding dependencies" here:
# https://github.com/bazelbuild/rules_go/blob/master/go/workspace.rst#id9
go_embed_data_dependencies()

go_rules_dependencies()

go_register_toolchains()

# enables packaging of various formats (tar, etc)
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_pkg",
    sha256 = "aeca78988341a2ee1ba097641056d168320ecc51372ef7ff8e64b139516a4937",
    urls = [
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.2.6-1/rules_pkg-0.2.6.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.2.6/rules_pkg-0.2.6.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

#local_repository(
#    name = "rules_debian",
#    path = "vendor/deb_packages",
#)

#########################################
# DOCKER
#########################################

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "4521794f0fba2e20f3bf15846ab5e01d5332e587e9ce81629c7f96c793bb7036",
    strip_prefix = "rules_docker-0.14.4",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.14.4/rules_docker-v0.14.4.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

# configures the docker toolchain, https://github.com/nlopezgi/rules_docker/blob/master/toolchains/docker/readme.md#how-to-use-the-docker-toolchain
container_repositories()

# This is NOT needed when going through the language lang_image
# "repositories" function(s).
load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//repositories:pip_repositories.bzl", "pip_deps")

pip_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)

#########################################
# NODE/TYPESCRIPT
#########################################
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "f9e7b9f42ae202cc2d2ce6d698ccb49a9f7f7ea572a78fd451696d03ef2ee116",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.6.0/rules_nodejs-1.6.0.tar.gz"],
)

#########################################
# SKYLIB - UTILITIES / FUNCTIONS FOR WRITING .BZL FILES
#########################################

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

#########################################
# INTERNAL RULES
#########################################

# allows us to reference the current version of bazel
load("//tools/rules:bazel_version.bzl", "bazel_version_repository")

bazel_version_repository(
    name = "bazel_version",
)

################################################################################
# EXTERNAL DEPENDENCIES
################################################################################

load(":deps.bzl", "go")

##########################################################
# NODE DEPENDENCIES
##########################################################

# configure rules_nodejs for this workspace
# note: this does not actually install the dependencies, see below
load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    # use custom node repositories based on public binary host so we can use
    # node versions not packaged with rules_node
    # see: https://bazelbuild.github.io/rules_nodejs/Built-ins.html#node_repositories
    # this is necessary because a specific version of node is required for
    # fabric modules
    ### List of all supported node versions
    # https://github.com/bazelbuild/rules_nodejs/blob/stable/nodejs/private/node_versions.bzl
    node_repositories = {
        "12.15.0-darwin_amd64": ("node-v12.15.0-darwin-x64.tar.gz", "node-v12.15.0-darwin-x64", "b6449cec39ac15b37abe4e59ef0eae50dcdfbf060c5276a01cc590f2a3372b7d"),
        "12.15.0-linux_amd64": ("node-v12.15.0-linux-x64.tar.gz", "node-v12.15.0-linux-x64", "218279a33603b8bc958c46cce04c14851fd9d685bd21f5a39d6b98d08d80aae5"),
        # add windows platform to make everything happy
        "12.15.0-windows_amd64": ("node-v12.15.0-win-x64.zip", "node-v12.15.0-win-x64", "48b29cab597962f12b0aac081522e6192bc8642c582cd0fc1bf51557273888da"),
        # 16.15.0
        "16.15.0-darwin_amd64": ("node-v16.15.0-darwin-x64.tar.gz", "node-v16.15.0-darwin-x64", "a6bb12bbf979d32137598e49d56d61bcddf8a8596c3442b44a9b3ace58dd4de8"),
        "16.15.0-linux_amd64": ("node-v16.15.0-linux-x64.tar.xz", "node-v16.15.0-linux-x64", "ebdf4dc9d992d19631f0931cca2fc33c6d0d382543639bc6560d31d5060a8372"),
        "16.15.0-windows_amd64": ("node-v16.15.0-win-x64.zip", "node-v16.15.0-win-x64", "dbe04e92b264468f2e4911bc901ed5bfbec35e0b27b24f0d29eff4c25e428604"),
    },
    # node_urls = ["https://nodejs.org/dist/v{version}/{filename}"],
    node_version = "16.15.0",
    package_json = ["//:package.json"],
    # NOTE: this is currently using rules_node version of yarn for all package
    #       manager operations, which is different than the one configured by
    #       .yarnrc.
    # TODO: coalesce the usage to the same version or rely only on rules_node
    #       yarn installation entirely
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

# Install any Bazel rules which were extracted earlier by the yarn_install rule.
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup TypeScript toolchain
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

# pull node binary because we have images where we need to have a different base
# but still leverage node tools
# TODO: figure out how to get the same thing out of the build targets generated
#       by rules_node above
http_archive(
    name = "node_12_dist",
    build_file_content = """
package(default_visibility = ["//visibility:public"])
load("@rules_pkg//:pkg.bzl", "pkg_tar")
pkg_tar(
  name = "tar",
  # need all of the docker binaries provided in the installation
  # based on installation instructions:
  # https://github.com/nodejs/help/wiki/Installation#how-to-install-nodejs-via-binary-archive-on-linux
  srcs = glob(['node-v12.15.0-linux-x64/**']),
  extension = "tar.gz",
  mode = "755",
  package_dir = "/usr/local/lib/nodejs",
  strip_prefix = "node-v12.15.0-linux-x64/"
)
""",
    sha256 = "218279a33603b8bc958c46cce04c14851fd9d685bd21f5a39d6b98d08d80aae5",
    urls = ["https://nodejs.org/dist/v12.15.0/node-v12.15.0-linux-x64.tar.gz"],
)

# pull in the node image
load(
    "@io_bazel_rules_docker//nodejs:image.bzl",
    _nodejs_image_repos = "repositories",
)

_nodejs_image_repos()

##########################################################
# GO DEPENDENCIES
##########################################################

# this function is generated using gazelle, we load and execute it here to
# reduce WORKSPACE file size
# gazelle:repository_macro deps.bzl%go
go()

##########################################################
# TOOLS
##########################################################

#load("//tools/bin:deps.bzl", install_tools = "install")

#install_tools()

# MAKE & GCC
#load("@rules_debian//:deb_packages.bzl", "deb_packages")

# The Debian stretch archive signing key
# Source: https://ftp-master.debian.org/keys.html
# Full fingerprint: E1CF 20DD FFE4 B89E 8026 58F1 E0B1 1894 F66A EC98
http_file(
    name = "stretch_archive_key",
    # It is highly recommended to use the sha256 hash of the key file to make sure it is untampered
    sha256 = "33b6a997460e177804cc44c7049a19350c11034719219390b22887471f0a2b5e",
    urls = ["https://ftp-master.debian.org/keys/archive-key-9.asc"],
)

#deb_packages(
#    name = "debian_stretch_amd64",
#    arch = "amd64",
#    distro = "stretch",
#    distro_type = "debian",
#    mirrors = [
#        "http://http.us.debian.org/debian",
#    ],
#    packages = {
#        "binutils": "pool/main/b/binutils/binutils_2.28-5_amd64.deb",
#        "g++": "pool/main/g/gcc-defaults/g++_6.3.0-4_amd64.deb",
#        "gcc": "pool/main/g/gcc-defaults/gcc_6.3.0-4_amd64.deb",
#        "gcc-6": "pool/main/g/gcc-6/gcc-6_6.3.0-18+deb9u1_amd64.deb",
#        "libasan3": "pool/main/g/gcc-6/libasan3_6.3.0-18+deb9u1_amd64.deb",
#        "libatomic1": "pool/main/g/gcc-6/libatomic1_6.3.0-18+deb9u1_amd64.deb",
#        "libc-dev-bin": "pool/main/g/glibc/libc-dev-bin_2.24-11+deb9u4_amd64.deb",
#        "libc6-dev": "pool/main/g/glibc/libc6-dev_2.24-11+deb9u4_amd64.deb",
#        "libcc1-0": "pool/main/g/gcc-6/libcc1-0_6.3.0-18+deb9u1_amd64.deb",
#        "libcilkrts5": "pool/main/g/gcc-6/libcilkrts5_6.3.0-18+deb9u1_amd64.deb",
#        "libgcc-6-dev": "pool/main/g/gcc-6/libgcc-6-dev_6.3.0-18+deb9u1_amd64.deb",
#        "libgomp1": "pool/main/g/gcc-6/libgomp1_6.3.0-18+deb9u1_amd64.deb",
#        "libitm1": "pool/main/g/gcc-6/libitm1_6.3.0-18+deb9u1_amd64.deb",
#        "liblsan0": "pool/main/g/gcc-6/liblsan0_6.3.0-18+deb9u1_amd64.deb",
#        "libmpx2": "pool/main/g/gcc-6/libmpx2_6.3.0-18+deb9u1_amd64.deb",
#        "libquadmath0": "pool/main/g/gcc-6/libquadmath0_6.3.0-18+deb9u1_amd64.deb",
#        "libtsan0": "pool/main/g/gcc-6/libtsan0_6.3.0-18+deb9u1_amd64.deb",
#        "libubsan0": "pool/main/g/gcc-6/libubsan0_6.3.0-18+deb9u1_amd64.deb",
#        "linux-libc-dev": "pool/main/l/linux/linux-libc-dev_4.9.228-1_amd64.deb",
#        "make": "pool/main/m/make-dfsg/make_4.1-9.1_amd64.deb",
#    },
#    packages_sha256 = {
#        "binutils": "b86a5bf3ff150ef74c1a452564c6480a8f81f3f27376b121a76783dc5e59d352",
#        "g++": "3b61f34c9fa121c01287251acaed3f5754ddb83788bfc0bd899ee859e9604861",
#        "gcc": "64902f7486389eaf20a9ff8efaed81cb41948b43453fb6be4472418bca0a231b",
#        "gcc-6": "c5a6be3bc9b061ea35f33444ae063581dea2dae7eb34f960b2ae371f03b5dec7",
#        "libasan3": "6c0176f148443307ac5d0a8a6e0db6e96fbfbc29bc973d13d62ec8aba53d68b9",
#        "libatomic1": "ef5519a8bab1b0ec0e44f40a5626b8891e9331fdcd9bb6980269f16d546bb26d",
#        "libc-dev-bin": "f165e460021e06cb932acdd00a892c01f96634be03b3299e66d397c7376dc2c6",
#        "libc6-dev": "3e7655930adc6ed69ddb1c263ef6fa428590e19479863785adc723367f6bf21d",
#        "libcc1-0": "1808ae68b1fa553becf248d7090f6d0dc0f64be6901328f0728adc3c036ec8fd",
#        "libcilkrts5": "2489bc1bac4b3ee2ed276620ae8ad06fade837c59569c055552623252d389419",
#        "libgcc-6-dev": "fbaa19b872bee99a443319da415ae2de346d72d15b12dc3d0a4c3607b154b884",
#        "libgomp1": "31f7549160118004fda234a88dbaa60df6d9611110b9ab0f5fa2da0b45ddce78",
#        "libitm1": "740114fcc1f943b869590ae2d86f0e715ccda931de310e96a640f05084496554",
#        "liblsan0": "8dbb4002c1b71fa022d6a84c7bfff3c8c4bc1f55e9a04b896769f7eb3fc7e10f",
#        "libmpx2": "2bc36bd599bf07300fbc0bc92f72a1796bbc55ee1d50cdcf8f4edddf9ea0c79f",
#        "libquadmath0": "a98030608d1b8eb07d2028ae5b03e1a83f6ae07fda4c765c096f5042992a27f0",
#        "libtsan0": "267b3cd479601cd128279fe2135ba0ca1b5c97658c64ef361d13cc32f63345e5",
#        "libubsan0": "294323c31db3b8d25bb7f8a89b36b7ec9419aa776d9c7d34a3452c50d6357d5e",
#        "linux-libc-dev": "ac6dd89cc5fafd046f185cc46d119180eaa72bb2090c89b3965eadae92d6f5e5",
#        "make": "577f98ca158bd55a32f6f5d1f57980d64136dab56c7e7b799d09a2aba6ba9de4",
#    },
#    pgp_key = "stretch_archive_key",
#)

##########################################################
# CONTAINER IMAGES
##########################################################

# UBUNTU
container_pull(
    name = "ubuntu_base",
    digest = "sha256:0925d086715714114c1988f7c947db94064fd385e171a63c07730f1fa014e6f9",
    registry = "index.docker.io",
    repository = "library/ubuntu",
)

# REDHAT MINIMAL BASE
# good for static binaries (e.g., produced by golang)
# tag: latest
container_pull(
    name = "redhat_minimal_base",
    registry = "registry.access.redhat.com",
    repository = "ubi8/ubi-minimal",
    tag = "latest",
)

# REDHAT STANDARD BASE
# good for people who cant handle THE MINIMUM. gluttons
# tag: latest
container_pull(
    name = "redhat_base",
    registry = "registry.access.redhat.com",
    repository = "ubi8/ubi",
    tag = "latest",
)

# BAZEL
# we want to use the same version of the container as the binary
container_pull(
    name = "bazel",
    digest = "sha256:ace9881e6e9c5d48b5fd637321361aeffe54000265894a65f7d818dc1065bd80",
    registry = "l.gcr.io",
    repository = "google/bazel",
    # tag = versions["bazel"], TODO: add sh_test that makes sure we match versions
)

# GIT
# this could be brought in via deb_packages, but this is simpler and allows
# for easily re-publishing and referencing in generic tekton tasks
# see tekton/tasks/git-push.ts for an example
container_pull(
    name = "alpine_git",
    digest = "sha256:f6f0b39d654c58a4474f458241b73ca7539bf511a4906450d5462c6a1fd004ca",
    registry = "index.docker.io",
    repository = "alpine/git",
)

# NODE
container_pull(
    name = "node_10_alpine",
    registry = "index.docker.io",
    repository = "node",
    tag = "10-alpine",
)

#Balaji: https://github.com/bazelbuild/bazel-gazelle/releases/tag/v0.24.0
############################################################
# Define your own dependencies here using go_repository.
# Else, dependencies declared by rules_go/gazelle will be used.
# The first declaration of an external repository "wins".
############################################################
gazelle_dependencies()
