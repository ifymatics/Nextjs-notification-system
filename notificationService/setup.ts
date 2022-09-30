import { mongoose } from "@typegoose/typegoose";
import { MongoMemoryServer } from "mongodb-memory-server";
export class MongoSetup {
    mongo: any;
    constructor() {
        Object.setPrototypeOf(this, MongoSetup.prototype);
        this.runBeforeAll();
        this.runBeforeEach();
        this.runafterAll()
    }

    runBeforeAll() {
        return beforeAll(async () => {
            this.mongo = await MongoMemoryServer.create();
            const mongoUri = this.mongo.getUri();

            await mongoose.connect(mongoUri)

        });
    }
    runBeforeEach() {
        return beforeEach(async () => {
            const collections = await mongoose.connection.db.collections();
            for (const collection of collections) {
                await collection.deleteMany({})
            };
        })
    }
    runafterAll() {

        return afterAll(async () => {
            await this.mongo.stop();
            await mongoose.connection.close();
        });
    }

}


//export const mongoMemoryTestDB = new MongoSetup();

