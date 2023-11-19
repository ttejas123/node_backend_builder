const generateCreateTableQueries = (tableData) => {
    let sqlQueries = [];

    tableData.forEach((table) => {
        let fields = table.fields.map(field => {
            if (field.name === 'id') {
                return 'id SERIAL PRIMARY KEY';
            } else {
                return `${field.name} ${mapToPostgresType(field.type)}`;
            }
        }).join(', ');

        // if (table.fields.some(field => field.join)) {
        //     let foreignKey = table.fields.find(field => field.join);
        //     fields += `, FOREIGN KEY (${foreignKey.name}) REFERENCES ${foreignKey.join}(${foreignKey.name})`;
        // }

        let query = `CREATE TABLE IF NOT EXISTS "${table.name}" (${fields});`;
        sqlQueries.push(query);
    });

    return "\n\n" + sqlQueries.join('\n\n') + "\n\n";
};

const mapToPostgresType = (type) => {
    switch (type.toLowerCase()) {
        case 'string':
            return 'VARCHAR(255)';
        case 'integer':
            return 'INTEGER';
        case 'boolean':
            return 'BOOLEAN';
        case 'timestamp':
            return 'TIMESTAMP';
        default:
            return type;
    }
};

module.exports =  generateCreateTableQueries
