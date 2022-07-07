## To Reproduce error
```
bazel run //:gazelle -- update-repos -repo_root=. -from_file=go.mod -prune=true -to_macro deps.bzl%go --build_file_generation=on --build_file_proto_mode=disable_global
bazel build //...
```


## Versions
```
Yarn version:
  1.19.1

Node version:
  16.15.0

Platform:
  linux x64

go - 1.17
bazel - 4.2.1
```
