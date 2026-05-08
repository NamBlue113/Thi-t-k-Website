let lessons = [];

const createLesson = (req, res) => {
    const newLesson = {
        id: Date.now().toString(),
        ...req.body,
    };

    lessons.push(newLesson);

    res.status(201).json({
        message: "Tạo bài học thành công",
        data: newLesson,
    });
};

const getLessons = (req, res) => {
    res.json(lessons);
};

const getLessonById = (req, res) => {
    const lesson = lessons.find((l) => l.id === req.params.id);

    if (!lesson) {
        return res.status(404).json({
            message: "Không tìm thấy bài học",
        });
    }

    res.json(lesson);
};

const updateLesson = (req, res) => {
    const index = lessons.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Không tìm thấy bài học",
        });
    }

    lessons[index] = {
        ...lessons[index],
        ...req.body,
    };

    res.json({
        message: "Cập nhật thành công",
        data: lessons[index],
    });
};

const deleteLesson = (req, res) => {
    const index = lessons.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Không tìm thấy bài học",
        });
    }

    const deleted = lessons[index];

    lessons.splice(index, 1);

    res.json({
        message: "Xóa thành công",
        data: deleted,
    });
};

module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
};