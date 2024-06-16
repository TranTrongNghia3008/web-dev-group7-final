from pymongo import MongoClient

# Connect to the MongoDB database
uri = "mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/tms-v00?retryWrites=true&w=majority&appName=WebDev-21TN-Group7"
client = MongoClient(uri)

# Access the database
db = client['tms-v00'] # tms-v01

# Prompt the user to enter the collection name and field name
collection_name = input("Nhập tên collection: ")
field_name = input("Nhập tên trường cần thêm: ")
default_value = input("Nhập giá trị mặc định cho trường: ")

# Access the collection
collection = db[collection_name]

# Iterate through all documents in the collection
for document in collection.find():
    if field_name not in document:
        collection.update_one(
            {'_id': document['_id']},
            {'$set': {field_name: default_value}}
        )

print(f"Đã thêm trường '{field_name}' với giá trị mặc định '{default_value}' cho tất cả các mục trong collection '{collection_name}' nếu trường đó chưa tồn tại.")
