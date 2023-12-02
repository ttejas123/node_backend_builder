const ProjectRouter = require("./Backend_service_helper/ProjectRouter")

const Backend_builder = (tableData, res_download) => {
  ProjectRouter(tableData, res_download, __dirname);
}

module.exports = Backend_builder