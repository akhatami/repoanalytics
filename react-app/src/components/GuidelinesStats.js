import React, {useEffect, useState} from 'react';
import axios from "axios";
import Loading from "./Loading";
import InfoBox from "./InfoBox";

function calcStats(repoDetails){
    const contributingLink = repoDetails.contributingGuidelines
        ? repoDetails.contributingGuidelines.url
        : null;

    // Link to issue template(s)
    const issueTemplateLinks = repoDetails.issueTemplates
        ? repoDetails.issueTemplates.map((template) => ({
            name: "Issue Template: " + template.name,
            filename: template.filename,
            url: contributingLink ? contributingLink.replace(/CONTRIBUTING\.md$/, 'ISSUE_TEMPLATE/' + template.filename) : '#',
        }))
        : null;

    // Link to PR template(s)
    const prTemplateLinks = repoDetails.pullRequestTemplates
        ? repoDetails.pullRequestTemplates.map((template) => ({
            filename: template.filename,
            url: contributingLink ? contributingLink.replace(/CONTRIBUTING\.md$/, template.filename) : '#',
        }))
        : null;

    const codeOfConductLink = repoDetails.codeOfConduct
        ? repoDetails.codeOfConduct.url
        : null;

    return {
        contributingLink,
        issueTemplateLinks,
        prTemplateLinks,
        codeOfConductLink,
    };
}
function GuidelinesStats({ repo_handle }){
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/repo_details/${repo_handle}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchData()
            .then((data) => {
                if (!data) {
                    setJsonData(null);
                } else{
                    setJsonData(data);
                }
            })
            .catch((error) => {
                console.error('Fetch data error:', error);
                setJsonData([])
            })
            .finally(() => {
                setLoading(false);
            });

    }, [repo_handle]);

    useEffect(() => {
        const updateStats = () => {
            if (jsonData) {
                const calculatedStats = calcStats(jsonData);
                setStats(calculatedStats);
            }
        };

        updateStats();
    }, [jsonData, calcStats]);

    return(
        <>
            <div className="row-sm-12">
                <h4 className="mb-3">Guidelines Stats</h4>
            </div>
            {loading ? (
                <Loading/>
            ) : (
            <>
                <InfoBox
                    colSize="3"
                    color="white"
                    iconClass="fa-question"
                    text="Contributing Guidelines"
                    link={stats.contributingLink || null}
                    number={stats.contributingLink ?  '' : ("Not Found")}
                />
                {stats.issueTemplateLinks &&
                    stats.issueTemplateLinks.length > 0 ? (
                        <>
                            {stats.issueTemplateLinks.map((template) => (
                                <InfoBox
                                    key={template.filename}
                                    colSize="3"
                                    color="white"
                                    iconClass="fa-file"
                                    text={template.name}
                                    link={template.url || null}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <InfoBox
                            colSize="3"
                            color="white"
                            iconClass="fa-file"
                            text="Issue Template"
                            number="Not Found"
                            />
                        </>
                    )}
                {stats.prTemplateLinks &&
                    stats.prTemplateLinks.length > 0 ? (
                        <>
                            {stats.prTemplateLinks.map((template) => (
                                <InfoBox
                                    key={template.filename}
                                    colSize="3"
                                    color="white"
                                    iconClass="fa-file-code"
                                    text="PR Template"
                                    link={template.url || null}
                                />
                            ))}
                        </>
                    ) : (
                    <>
                        <InfoBox
                            colSize="3"
                            color="white"
                            iconClass="fa-file-code"
                            text="PR Template"
                            number="Not Found"
                        />
                    </>
                )}
                <InfoBox
                    colSize="3"
                    color="white"
                    iconClass="fa-gavel"
                    text="Code of Conduct"
                    link={stats.codeOfConductLink || null}
                    number={stats.codeOfConductLink ?  '' : ("Not Found")}
                />
            </>
            )}
        </>
    );
}

export default GuidelinesStats;
