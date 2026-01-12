# TODO: Fix Lesson-Planning-Platform Issues

## Backend Fixes

- [x] Update Gemini model in lesson.controller.js to "gemini-1.5-pro" and add error handling
- [x] Fix "hasedPassword" typo in user.controller.js
- [x] Fix typos in prompts.js ("assesment" -> "assessment", etc.)
- [x] Change grade to string in zod.js
- [x] Update lesson.model.js: creatorId to ObjectId with ref
- [x] Update lesson.controller.js: Use req.userId for creatorId
- [x] Add auth middleware to lesson routes

## Frontend Fixes

- [x] Standardize auth checks to use localStorage consistently

## Testing

- [ ] Test signup, create lesson plan, download doc
- [ ] Verify no errors in doc content
