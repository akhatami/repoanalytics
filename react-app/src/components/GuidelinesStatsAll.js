import React, {useEffect, useState} from 'react';
import axios from "axios";
import Loading from "./Loading";
import InfoBox from "./InfoBox";

function calcStats(repos) {
    let contributingLinkCount = 0;
    let issueTemplateLinkCount = 0;
    let prTemplateLinkCount = 0;
    let codeOfConductLinkCount = 0;
    const reposCount = repos.length;

    repos.forEach((repo) => {
        const contributingLink = repo.contributingGuidelines ? repo.contributingGuidelines.url : null;

        if (contributingLink) {
            contributingLinkCount++;
        }

        const issueTemplateLinks = repo.issueTemplates
            ? repo.issueTemplates.map((template) => ({
                name: "Issue Template: " + template.name,
                filename: template.filename,
                url: contributingLink ? contributingLink.replace(/CONTRIBUTING\.md$/, 'ISSUE_TEMPLATE/' + template.filename) : '#',
            }))
            : null;

        if (issueTemplateLinks && issueTemplateLinks.length > 0) {
            issueTemplateLinkCount++;
        }

        const prTemplateLinks = repo.pullRequestTemplates
            ? repo.pullRequestTemplates.map((template) => ({
                filename: template.filename,
                url: contributingLink ? contributingLink.replace(/CONTRIBUTING\.md$/, template.filename) : '#',
            }))
            : null;

        if (prTemplateLinks && prTemplateLinks.length > 0) {
            prTemplateLinkCount++;
        }

        const codeOfConductLink = repo.codeOfConduct ? repo.codeOfConduct.url : null;

        if (codeOfConductLink) {
            codeOfConductLinkCount++;
        }
    });

    return {
        contributingLinkCount,
        issueTemplateLinkCount,
        prTemplateLinkCount,
        codeOfConductLinkCount,
        reposCount,
    };
}

function GuidelinesStatsAll(){
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/repo_details/all`);
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

    }, []);

    useEffect(() => {
        const updateStats = () => {
            if (jsonData) {
                const calculatedStats = calcStats(jsonData);
                setStats(calculatedStats);
                setLoading(false);
            }
        };

        updateStats();
    }, [jsonData, calcStats]);

    const [isStatsOpen, setStatsOpen] = useState(false);

    const toggleStats = () => {
        setStatsOpen(!isStatsOpen);
    };
    return(
        <>
            <div className="row-sm-12">
                <h4 className="mb-3">
                    Overall Guidelines Stats
                    <button className="btn btn-link" onClick={toggleStats}>
                        {isStatsOpen ? (
                            <i className="fas fa-chevron-up"></i>
                        ) : (
                            <i className="fas fa-chevron-down"></i>
                        )}
                    </button>
                </h4>
            </div>
            <div className="row">
            {isStatsOpen ? (
                loading ? (
                <Loading containerHeight='15vh'/>
                ) : (
                <>
                    <p>Over {stats.reposCount} repositories in our dataset.</p>
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-question"
                        text="Repos with Contributing Guidelines"
                        number={`${stats.contributingLinkCount} (${((stats.contributingLinkCount / stats.reposCount) * 100).toFixed(1)}%)`}
                    />
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-file"
                        text="Repos with Issue Template"
                        number={`${stats.issueTemplateLinkCount} (${((stats.issueTemplateLinkCount / stats.reposCount) * 100).toFixed(1)}%)`}
                    />
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-file"
                        text="Repos with PR Template"
                        number={`${stats.prTemplateLinkCount} (${((stats.prTemplateLinkCount / stats.reposCount) * 100).toFixed(1)}%)`}
                    />
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-file"
                        text="Repos with Code of Conduct"
                        number={`${stats.codeOfConductLinkCount} (${((stats.codeOfConductLinkCount / stats.reposCount) * 100).toFixed(1)}%)`}
                    />
                </>
                )
            ) : null}
            </div>
        </>
    );
}

export default GuidelinesStatsAll;
