export default async function getUser(database, username) {
  try {
    const result = await database
      .collection('helios-users-collection')
      .find({
        username: username
      }).toArray();

    if(result.length > 0) return result[0]    
    return null;
  } catch (err) {
    console.error(err);
    
    return null;
  }
}