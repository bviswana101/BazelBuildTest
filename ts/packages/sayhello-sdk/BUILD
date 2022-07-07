package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:index.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "copy_to_bin")

ts_library(
    name = "sayhello-sdk",
    srcs = glob(
        ["**/*.ts"],
        [
            "**/*.test.ts",
            "**/*.spec.ts",
            "node_modules/**/*.ts",
        ],
    ),
    data = ["openapi.json"],
    runtime = "nodejs",
    deps = [
        "@npm//@types/node",
        "@npm//@types/request",
        "@npm//request",
    ],
)

# need to bring openapi.json with us to output
# setting makes sure that non-javascript resources are present alongside the binaries built by bazel
# i.e. JSON files that are loaded by the services are included in the container / javascript bundle that is built
copy_to_bin(
    name = "open-api-spec",
    srcs = ["openapi.json"],
)

# Auto-generated sdk's will not have test to wire up

# TODO: remove the index.spec.ts when off elmer
