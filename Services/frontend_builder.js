const ProjectRouter = require("./Frontend_service_helper/ProjectRouter")

const frontend_builder = (tableData, res_download) => {
  ProjectRouter(tableData, res_download, __dirname);
}

module.exports = frontend_builder