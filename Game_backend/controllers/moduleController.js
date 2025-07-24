import Module from '../models/Module.js';

export const createModule = async (req, res) => {
  const { title, description, category, difficulty } = req.body;

  try {
    const module = new Module({
      title,
      description,
      category,
      difficulty,
      createdBy: req.userId // Assumes token middleware sets req.userId
    });

    await module.save();
    res.status(201).json({ msg: 'Module created', module });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create module' });
  }
};


export const getModules = async (req, res) => {
    try {
      const modules = await Module.find().populate('lessons', 'title'); // Only include lesson titles
      res.json(modules);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  };

export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('lessons')   // optional: populate lessons if you want full data
      .populate('createdBy', 'name email'); // optional: creator info

    // Return as object with 'modules' key
    res.status(200).json({ modules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};
// export const getModuleById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const module = await Module.findById(id)
//       .populate('lessons', 'title order'); // Populate only title & order of lessons

//     if (!module) return res.status(404).json({ msg: 'Module not found' });

//     res.status(200).json(module);
//   } catch (err) {
//     console.error('Error fetching module:', err);
//     res.status(500).json({ msg: 'Failed to fetch module' });
//   }
// };

export const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.status(200).json({ message: 'Module deleted successfully', module: deletedModule });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error });
  }
};