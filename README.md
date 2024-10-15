# RepoInsights
RepoInsights is a dashboard for gaining quality assurance insights into the development of open-source project repositories on GitHub.

How to setup:
- Collect data using python scripts in ``data_collectors`` directory, or use the provided database dump.
- Setup the server from ``server`` directory, by first installing the required JS packages (``npm install``) and then run it (``npm start``). 
- Setup the client react app from ``react-app`` similar to the JS server.
- In all the above steps provide the required configs or environment variables in a ``.env`` file accordingly (e.g, database configs, GitHub API tokens, etc.).

## How to Cite the Paper

If you use RepoInsights in your research, please cite our paper using the following BibTeX entry:

```bibtex
@inproceedings{khatami2024software,
  title={Software Quality Assurance Analytics: Enabling Software Engineers to Reflect on QA Practices},
  author={Khatami, Ali and Brandt, Carolin and Zaidman, Andy},
  booktitle={24th IEEE International Working Conference on Source Code Analysis and Manipulation (SCAM). IEEE},
  year={2024}
}
```

Alternatively, you can use the following citation format:

Khatami, A., Brandt, C., & Zaidman, A. (2024). Software Quality Assurance Analytics: Enabling Software Engineers to Reflect on QA Practices. In 24th IEEE International Working Conference on Source Code Analysis and Manipulation (SCAM). IEEE.
