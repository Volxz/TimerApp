const CosmosClient = require("@azure/cosmos").CosmosClient;
const dbContext = require("./databaseContext");

const endpoint = process.env.CosmosEndpoint;
const key = `/${process.env.CosmosPartitionKey}`;
const databaseId  = process.env.CosmosDatabase;

const containerId = "Timers";

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);
dbContext.create(client, databaseId, containerId);

class TimerHelper {

    async createDocument(data) {
        const { resource: createdItem } = await container.items.create(data);
        return createdItem;
    }

    async getAllTimers() {
        // query to return all items
        const querySpec = {
            query: "SELECT * from " + containerId
        };

        // read all items in the Items container
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();
        return items;
    }

    async getByID(id) {
        const { resource: item } = await container.item(id, undefined).read();
        if (!item) {
            return null;
        }
        return item;
    }


    async delete(id) {
        let item;
        // read all items in the Items container
        try {
            item = container.item(id, undefined);
            await item.delete();
            return id;
        }
        catch (e) {
            return null;
        } 
    }

    update(timer) {
        container
            .item(`${id}`,undefined)
            .replace(timer);
    }

}

module.exports = ContactHelper;