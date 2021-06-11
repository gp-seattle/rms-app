import { MetricsClient } from "./MetricsClient"
import { CloudWatch } from "aws-sdk"
import { PutMetricDataInput } from "aws-sdk/clients/cloudwatch"

const NAMESPACE_PREFIX = "gp-seattle-inventory/"

export class CloudWatchClient implements MetricsClient {
    private readonly context: string
    private readonly cw: CloudWatch

    public constructor(context: string, options?: CloudWatch.ClientConfiguration) {
        this.context = context
        this.cw = new CloudWatch(options)
    }

    emitPromiseMetrics<T>(
        executable: () => Promise<T>,
        namespace: string,
        name: string
    ): Promise<T> {
        var startTime: number = Date.now()

            return executable()
                .then(
                    (response: T) => {
                        return this.emitDuration(namespace, name, startTime)
                            .then(() => this.emitErrors(namespace, name, 0))
                            .then(() => response)
                    },
                    (reason: any) => {
                        throw this.emitErrors(namespace, name, 1)
                            .then(() => { throw reason })
                    }
                )
    }

    private emitDuration(namespace: string, name: string, startTime: number): Promise<{}> {
        var duration: number = Date.now() - startTime
        var param: PutMetricDataInput = {
            Namespace: NAMESPACE_PREFIX + namespace,
            MetricData: [
                {
                    MetricName: "Duration",
                    Value: duration,
                    Unit: "Milliseconds"
                },
                {
                    MetricName: "Duration",
                    Dimensions: [
                        { Name: "Name", Value: name },
                        { Name: "InvokedFrom", Value: this.context }
                    ],
                    Value: duration,
                    Unit: "Milliseconds"
                }
            ]
        }
        return this.cw.putMetricData(param).promise()
    }

    private emitErrors(namespace: string, name: string, value: 0 | 1): Promise<{}> {
        var param: PutMetricDataInput = {
            Namespace: NAMESPACE_PREFIX + namespace,
            MetricData: [
                {
                    MetricName: "Errors",
                    Value: value,
                    Unit: "Count"
                },
                {
                    MetricName: "Errors",
                    Dimensions: [
                        { Name: "Name", Value: name },
                        { Name: "InvokedFrom", Value: this.context }
                    ],
                    Value: value,
                    Unit: "Count"
                }
            ]
        }
        return this.cw.putMetricData(param).promise()
    }
}