from pymongo import MongoClient
from bson import ObjectId

# Connect to the MongoDB database
uri = "mongodb+srv://admin:3erkkrKTy2EJBjUl@webdev-21tn-group7.dmacvr7.mongodb.net/tms-v00?retryWrites=true&w=majority&appName=WebDev-21TN-Group7"
client = MongoClient(uri)

# Access the database
db = client['tms-v00'] # tms-v01

# Prompt the user to enter the collection name and field name
collection_name = input("Nhập tên collection: ")
field_name = input("Nhập tên trường cần thêm: ")

# Prompt the user to enter the type of the value
value_type = input("Nhập loại giá trị (string/int/objectid): ").strip().lower()

# Prompt the user to enter the value
if value_type == "objectid":
    value = ObjectId(input("Nhập giá trị ObjectId: "))
elif value_type == "int":
    value = int(input("Nhập giá trị int: "))
else:
    value = input("Nhập giá trị string: ")

# Access the collection
collection = db[collection_name]

# Iterate through all documents in the collection
for document in collection.find():
    # Check if the field already exists in the document
    if field_name not in document:
        # Add the field with the appropriate value
        collection.update_one(
            {'_id': document['_id']},
            {'$set': {field_name: value}}
        )

print(f"Đã thêm trường '{field_name}' với giá trị '{value}' cho tất cả các mục trong collection '{collection_name}' nếu trường đó chưa tồn tại.")
