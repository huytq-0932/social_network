var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.seed = function (knex, Promise) {
    let initObj = {
        name: 'root',
        password: '$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi',
    };
    // Deletes ALL existing entries
    return knex('users').del()
        .then(() => __awaiter(this, void 0, void 0, function* () {
        // Inserts seed entries
        yield knex('users').insert(initObj);
        yield knex.raw('select setval(\'users_id_seq\', max(id)) from users');
    }));
};
