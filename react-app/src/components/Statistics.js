import React from 'react';
import TestingStatsAll from "./TestingStatsAll";
import PullRequestStatsAll from "./PullRequestStatsAll";

function Statistics(){
    return(
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">
                                Statistics
                            </h3>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <TestingStatsAll />
                </div>
                <div className="row">
                    <PullRequestStatsAll />
                </div>
            </section>
        </div>
    );
}

export default Statistics;
