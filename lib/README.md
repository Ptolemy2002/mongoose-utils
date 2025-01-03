# Mongoose Utils
This library provides utility functions for working with Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment.

## Type Reference
```typescript
import { MaybeArray, MaybeTransformer, Override } from "@ptolemy2002/ts-utils";
import { PipelineStage } from "mongoose";

type ThenValue<StageType extends string> =
    MaybeTransformer<
        MaybeArray<StageType | PipelineStage>, [AggregationBuilder<StageType>]
    >
;

type StageGeneration<StageType extends string> = {
    type: StageType | "unknown",
    stages: PipelineStage[]
};
```

## Classes
The following classes are available in the library:

### AggregationBuilder<StageType extends string, Options={}>
This class is used to build an aggregation pipeline. It is heavily recommended to not instantiate this class directly, but rather extend it, overriding the `generateStage` method and specifying generic parameters.

The `StageType` generic parameter specifies the type of stages that can be added to the pipeline. The `Options` generic parameter specifies the options that can be used as context for the aggregation pipeline.

#### Instance Properties
- `options` (`Partial<Options>`) - The options for the aggregation pipeline. Note that this is a partial, meaning none of the properties need to be specified. To require some options use the `requireOptions` method.
- `protected pipeline` (`StageGeneration<StageType>[]`) - The stages that have been added to the pipeline. This property should not be accessed directly.

#### Instance Methods
##### setOptions
Sets the specified options, overriding any existing options.

###### Parameters
- `options?` (`Partial<Options>`) - The options to set. If not specified, no options will be set.

###### Returns
- `this` - The instance of the class.

##### requireOptions<K extends keyof Options>
Given the specified keys, ensures those options are set (not `undefined`). If this check fails, an `Error` will be thrown with a default message specifying which options are missing and your `customMessage` if specified. You can modify the error to be thrown by specifying a third argument that is a function taking the final message and missing keys as arguments and returning the error to throw.

The function acts as a type guard, returning the `options` instance with an alias to make the specified keys required.

###### Parameters
- `keys` (`K[]`) - The keys to check for in the options.
- `customMessage?` (`string`) - A custom message to display if the check fails.
- `createError?` (`(message: string, missingKeys: K[]) => Error`) - A function to create the error to throw. By default creates a base `Error` with the message.

###### Returns
- `Override<Options, { [key in K]: NonNullable<Options[key]> }>` - The options with the specified keys required.

#### generateStage
Generates a stage for the aggregation pipeline. This method should be overridden in a subclass to specify the implementation of the stage generation.

###### Parameters
- `stage` (`StageType`) - The stage to generate.

###### Returns
- `StageGeneration<StageType>` - The generated stage.

#### then
Given a `ThenValue`, adds the specified stages to the pipeline, returning the same instance called upon. `ThenValue` has the following options:
- `StageType` - Adds a single stage to the pipeline, generating it using the `generateStage` method.
- `PipelineStage` - Adds a single stage to the pipeline. This will add a `StageGeneration` with the type `"unknown"`.
- An array of either of the above - Adds multiple stages to the pipeline.
- A function returning one of the above - Will be passed the current instance as the only parameter and add the stages returned by the function.

###### Parameters
- `stage` (`ThenValue<StageType>`) - The value to add to the pipeline.

###### Returns
- `this` - The instance of the class.

#### build
Builds the aggregation pipeline, returning the pipeline as an array of stages.

###### Returns
- `PipelineStage[]` - The aggregation pipeline.

#### compose
Given another `AggregationBuilder`, composes the two pipelines together, returning the same instance called upon.

###### Parameters
- `builder` (`AggregationBuilder<StageType>`) - The builder to compose with.

###### Returns
- `this` - The instance of the class.

## Peer Dependencies
- `@ptolemy2002/ts-utils^2.3.0`
- `is-callable^1.2.7`
- `mongoose^8.9.3`

## Commands
The following commands exist in the project:

- `npm run uninstall` - Uninstalls all dependencies for the library
- `npm run reinstall` - Uninstalls and then Reinstalls all dependencies for the library
- `npm run example-uninstall` - Uninstalls all dependencies for the example app
- `npm run example-install` - Installs all dependencies for the example app
- `npm run example-reinstall` - Uninstalls and then Reinstalls all dependencies for the example app
- `npm run example-start` - Starts the example app after building the library
- `npm run build` - Builds the library
- `npm run release` - Publishes the library to npm without changing the version
- `npm run release-patch` - Publishes the library to npm with a patch version bump
- `npm run release-minor` - Publishes the library to npm with a minor version bump
- `npm run release-major` - Publishes the library to npm with a major version bump