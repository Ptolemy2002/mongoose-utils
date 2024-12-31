import { AggregationBuilder } from "@ptolemy2002/mongoose-utils";

type MyAggregationBuilderStage = "stage1" | "stage2";
type MyAggregationBuilderOptions = {
    option1: string;
    option2: string;
};
class MyAggregationBuilder extends AggregationBuilder<MyAggregationBuilderStage, MyAggregationBuilderOptions> {
    generateStage(stage: MyAggregationBuilderStage) {
        switch (stage) {
            case "stage1":
                this.requireOptions(["option1"], "This is a custom message");

                return {
                    type: stage,
                    stages: [
                        {
                            $match: {
                                field: this.options.option1
                            }
                        }
                    ]
                };
            case "stage2":
                this.requireOptions(["option2"], "This is another custom message");
                return {
                    type: stage,
                    stages: [
                        {
                            $group: {
                                _id: `$${this.options.option2}`,
                                count: { $sum: 1 }
                            }
                        }
                    ]
                };
        }
    }
}

const builder = new MyAggregationBuilder();

try {
    builder.then("stage1")
    console.error("Unexpectedly succeeded in executing stage1 without option1");
} catch (e) {
    console.error("Error executing stage1:", e.message);
    console.error("This is expected because option1 is missing");
}

builder.setOptions({ option1: "value1" });

try {
    builder.then("stage1")
    console.log("Successfully executed stage1 with option1");
} catch (e) {
    console.error("Unexpected error executing stage1 with option1:", e.message);
}

try {
    builder.then("stage2")
    console.error("Unexpectedly succeeded in executing stage2 without option2");
} catch (e) {
    console.error("Error executing stage2:", e.message);
    console.error("This is expected because option2 is missing");
}

builder.setOptions({ option2: "value2" });

try {
    builder.then("stage2")
    console.log("Successfully executed stage2 with option2");
} catch (e) {
    console.error("Unexpected error executing stage2 with option2:", e.message);
}

console.log("Pipeline stages:", builder.build());