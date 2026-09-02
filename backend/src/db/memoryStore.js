// Instant In-Memory Database Store Fallback

class MemoryCollection {
  constructor(initialData = []) {
    this.items = [...initialData];
  }

  find(query = {}) {
    let results = [...this.items];
    if (query.status && query.status !== 'All') {
      results = results.filter(i => i.status === query.status);
    }
    if (query.priority && query.priority !== 'All') {
      results = results.filter(i => i.priority === query.priority);
    }
    if (query.category && query.category !== 'All') {
      results = results.filter(i => i.category === query.category);
    }
    if (query.$or && Array.isArray(query.$or)) {
      results = results.filter(i => {
        return query.$or.some(cond => {
          const key = Object.keys(cond)[0];
          const regex = cond[key]?.$regex;
          if (!regex) return false;
          const val = i[key];
          if (Array.isArray(val)) {
            return val.some(v => new RegExp(regex, 'i').test(v));
          }
          return new RegExp(regex, 'i').test(String(val || ''));
        });
      });
    }

    const resArray = [...results];
    resArray.sort = function(sortObj = {}) {
      if (sortObj.created_at === -1) {
        resArray.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      } else if (sortObj.timestamp === -1) {
        resArray.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      }
      return resArray;
    };
    return resArray;
  }

  async findOne() {
    return this.items[0] || null;
  }

  async findById(id) {
    const item = this.items.find(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (!item) return null;
    return {
      ...item,
      save: async () => {
        const idx = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
        if (idx !== -1) this.items[idx] = item;
        return item;
      }
    };
  }

  async create(data) {
    const newItem = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      ...data
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async insertMany(arr) {
    const formatted = arr.map((item, idx) => ({
      _id: 'mem_' + (Date.now() + idx) + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      ...item
    }));
    this.items.push(...formatted);
    return formatted;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const idx = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...updateData };
    return this.items[idx];
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (idx === -1) return null;
    const deleted = this.items.splice(idx, 1)[0];
    return deleted;
  }

  async countDocuments() {
    return this.items.length;
  }
}

const memoryStore = {
  Incident: new MemoryCollection(),
  Asset: new MemoryCollection(),
  ServiceRequest: new MemoryCollection(),
  ChangeRequest: new MemoryCollection(),
  ActivityLog: new MemoryCollection(),
  KnowledgeBase: new MemoryCollection(),
  isMemoryMode: false
};

module.exports = memoryStore;
