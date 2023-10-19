import React from "react";
import InfoBox from "./InfoBox";

function Home(){
    return(
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">
                                Overview
                            </h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-end">
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <InfoBox colSize="4" color="green" iconClass="fa-code" text="Available repositories" number={50} />
                    <InfoBox colSize="4" color="blue" iconClass="fa-check" text="Repositories added this week" number={5} />
                    <InfoBox colSize="4" color="yellow" iconClass="fa-calendar" text="Last Update" number={"19-10-2023"} />
                </div>
                <div className="row">
                <h3>
                    Explore
                </h3>
                </div>
                <div className="row">
                    <InfoBox colSize="6" color="orange" iconClass="fa-search" text="Search among available repositories" path="/repositories" />
                    <InfoBox colSize="6" color="maroon" iconClass="fa-envelope" text="Request to add a new repository" path="/request" />
                    <InfoBox colSize="6" color="navy" iconClass="fa-chart-pie" text="Dataset and Statistics" path="/statistics" />
                    <InfoBox colSize="6" color="cyan" iconClass="fa-info" text="About RepoInsights" path="/about" />
                </div>
            </section>
        </div>
    );
}

export default Home;
