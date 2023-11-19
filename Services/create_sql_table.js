const generateCreateTableQueries = (tableData) => {
    let sqlQueries = [];

    tableData.forEach((table) => {
        let fields = table.fields.map(field => `${field.name} ${mapToPostgresType(field.type)}`).join(', ');
        let primaryKey = table.fields.find(field => field.name === 'id') ? 'id' : '';

        let query = `CREATE TABLE IF NOT EXISTS "${table.name}" (${fields}`;

        if (primaryKey) {
            query += `, PRIMARY KEY (${primaryKey})`;
        }

        if (table.fields.some(field => field.join)) {
            let foreignKey = table.fields.find(field => field.join);
            query += `, FOREIGN KEY (${foreignKey.name}) REFERENCES ${foreignKey.join}(${primaryKey})`;
        }

        query += ');';
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
