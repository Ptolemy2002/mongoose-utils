import { MaybeArray, MaybeTransformer, Override } from "@ptolemy2002/ts-utils";
import { PipelineStage } from "mongoose";
import isCallable from "is-callable";

export type ThenValue<StageType extends string> =
    MaybeTransformer<
        MaybeArray<StageType | PipelineStage>, [AggregationBuilder<StageType>]
    >
;
export type StageGeneration<StageType extends string> = {
    type: StageType | "unknown",
    stages: PipelineStage[]
};

export class AggregationBuilder<StageType extends string, Options={}> {
    options: Partial<Options> = {};
    protected pipeline: StageGeneration<StageType>[] = [];

    constructor(
        options: Partial<Options> = {},
    ) {
        this.setOptions(options);
    }

    setOptions(options?: Partial<Options>) {
        this.options = { ...this.options, ...(options ?? {}) };
        return this;
    }

    requireOptions<K extends keyof Options>(
        keys: K[], customMessage?: string,
        createError: (message: string, missingKeys: K[]) => Error = (message) => new Error(message)
    ) {
        const missingKeys = keys.filter(key => this.options[key] === undefined);
        if (missingKeys.length > 0) {
            const message = `Missing required options: ${missingKeys.join(", ")}`;
            if (customMessage) {
                throw createError(`${message}. ${customMessage}`, missingKeys);
            } else {
                throw createError(message, missingKeys);
            }
        }

        return this.options as Override<Options, { [key in K]: NonNullable<Options[key]> }>;
    }

    generateStage(stage: StageType): StageGeneration<StageType> {
        return {
            type: stage,
            stages: []
        };
    }

    then(stage: ThenValue<StageType>) {
        if (isCallable(stage)) stage = stage(this);
        if (!Array.isArray(stage)) stage = [stage];

        this.pipeline.push(...(
            stage.reduce((acc, val) => {
                if (typeof val === "string") {
                    acc.push(this.generateStage(val));
                } else {
                    acc.push({
                        type: "unknown",
                        stages: [val]
                    });
                }

                return acc;
            }, [] as StageGeneration<StageType>[])
        ));
        return this;
    }

    build(): PipelineStage[] {
        return this.pipeline.reduce((acc, val) => {
            acc.push(...val.stages);
            return acc;
        }, [] as PipelineStage[]);
    }

    compose(other: AggregationBuilder<StageType>): this {
        this.pipeline.push(...other.pipeline);
        return this;
    }
}
