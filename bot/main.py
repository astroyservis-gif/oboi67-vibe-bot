import asyncio
import logging
import os
from contextlib import asynccontextmanager

from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, StateFilter
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import FSInputFile, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load env vars
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
admin_id_raw = os.getenv("ADMIN_ID")

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN is not set. Please provide it in environment variables.")
if not admin_id_raw:
    raise RuntimeError("ADMIN_ID is not set. Please provide it in environment variables.")

try:
    ADMIN_ID = int(admin_id_raw)
except ValueError as exc:
    raise RuntimeError("ADMIN_ID must be a numeric Telegram user ID.") from exc  # Yuri's telegram ID

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

# --- MODELS ---
class Lead(BaseModel):
    name: str
    phone: str
    message: str | None = None
    source: str = "Website Contact Form"

class CalcStates(StatesGroup):
    wallpaper_type = State()
    area_mode = State()
    area_exact = State()
    house_type = State()
    ceiling_height = State()
    floor_area = State()
    dismantle = State()
    primer = State()
    waiting_for_contact = State()

# --- PRICES ---
PRICES = {
    ## "Виниловые": 350,
    "Флизелин": 250,
    "Бумага": 300,
    "Фотообои": 350,
    "Демонтаж": 150,
    "Грунтовка": 70
}

# --- KEYBOARDS ---
def get_main_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📏 Рассчитать стоимость", callback_data="calc_start")
    builder.button(text="📸 Посмотреть работы", callback_data="portfolio_menu")
    builder.button(text="🤝 Почему Юрию доверяют", callback_data="about_master")
    builder.button(text="❓ Ответы на вопросы", callback_data="faq_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_portfolio_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📐 Стыки и детали", callback_data="portfolio_details")
    builder.button(text="💎 Фотообои", callback_data="portfolio_premium")
    builder.button(text="🏠 Общий вид", callback_data="portfolio_general")
    builder.button(text="⬅️ Назад", callback_data="main_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_wallpaper_type_keyboard():
    builder = InlineKeyboardBuilder()
    ## builder.button(text="Виниловые", callback_data="type:Виниловые")
    builder.button(text="Флизелин", callback_data="type:Флизелин")
    builder.button(text="Бумага", callback_data="type:Бумага")
    builder.button(text="Фотообои", callback_data="type:Фотообои")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(2, 2, 1)
    return builder.as_markup()

def get_dismantle_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Да", callback_data="dismantle:yes")
    builder.button(text="Нет", callback_data="dismantle:no")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(2, 1)
    return builder.as_markup()

def get_primer_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Да", callback_data="primer:yes")
    builder.button(text="Нет", callback_data="primer:no")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(2, 1)
    return builder.as_markup()

def get_area_mode_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📏 Введу точную площадь", callback_data="area_mode:exact")
    builder.button(text="🏠 Выбрать по типу жилья", callback_data="area_mode:house")
    builder.button(text="📐 Посчитать по площади пола", callback_data="area_mode:floor")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_house_type_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Комната (15 м² по полу)", callback_data="house:room")
    builder.button(text="1-к квартира", callback_data="house:1bed")
    builder.button(text="2-к квартира", callback_data="house:2bed")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_ceiling_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Стандарт (2.5-2.6м)", callback_data="ceiling:std")
    builder.button(text="Новостройка (2.7-2.8м)", callback_data="ceiling:new")
    builder.button(text="Высокие (3м+)", callback_data="ceiling:high")
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_back_to_main_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="⬅️ Вернуться в начало", callback_data="main_menu")
    return builder.as_markup()

def get_contact_keyboard():
    kb = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="📱 Отправить номер телефона", request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    return kb

def get_yuri_contact_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📏 Рассчитать цену", callback_data="calc_start")
    builder.button(text="📱 Написать Юрию в личку", url="https://t.me/Yura_Oboi67") # Replace with real link
    builder.button(text="❓ Ответы на вопросы", callback_data="faq_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_faq_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Сколько времени занимает одна комната?", callback_data="faq_time")
    builder.button(text="Что делать, если через месяц разойдется стык?", callback_data="faq_warranty")
    builder.button(text="Нужно ли мне покупать клей и пленку?", callback_data="faq_materials")
    builder.button(text="Как подготовить комнату к вашему приходу?", callback_data="faq_prep")
    builder.button(text="⬅️ Назад", callback_data="main_menu")
    builder.adjust(1)
    return builder.as_markup()

def get_faq_answer_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="Сколько времени занимает одна комната?", callback_data="faq_time")
    builder.button(text="Что делать, если через месяц разойдется стык?", callback_data="faq_warranty")
    builder.button(text="Нужно ли мне покупать клей и пленку?", callback_data="faq_materials")
    builder.button(text="Как подготовить комнату к вашему приходу?", callback_data="faq_prep")
    builder.button(text="📏 Рассчитать стоимость", callback_data="calc_start")
    builder.button(text="📸 Посмотреть работы", callback_data="portfolio_menu")
    builder.button(text="🤝 Почему Юрию доверяют", callback_data="about_master")
    builder.button(text="📢 Канал: Секреты идеальных стен", url="https://t.me/oboi_pro_67")
    builder.adjust(1)
    return builder.as_markup()

def get_faq_return_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📏 Рассчитать стоимость", callback_data="calc_start")
    builder.button(text="📸 Посмотреть работы", callback_data="portfolio_menu")
    builder.button(text="🤝 Почему Юрию доверяют", callback_data="about_master")
    builder.button(text="📢 Канал: Секреты идеальных стен", url="https://t.me/oboi_pro_67")
    builder.adjust(1)
    return builder.as_markup()

def get_calc_return_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(text="📈 Рассчитать мой проект", callback_data="calc_start")
    builder.button(text="⬅️ Назад", callback_data="portfolio_menu")
    builder.adjust(1)
    return builder.as_markup()

# --- HANDLERS ---
@dp.message(CommandStart(), StateFilter('*'))
@dp.callback_query(F.data == "main_menu", StateFilter('*'))
async def command_start_handler(event: types.Message | types.CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    welcome_text = (
        f"Здравствуйте, {event.from_user.full_name if isinstance(event, types.Message) else event.from_user.full_name}! 👋\n\n"
        "Я — бот-помощник Юрия Косенкова, специалиста по поклейке обоев в Смоленске.\n"
        "Если вам нужно аккуратно поклеить обои, но нет времени вникать в детали и контролировать каждый шаг — вы по адресу.\n"
        "Юрий берет все хлопоты на себя: от правильной грунтовки до уборки мусора.\n"
        "Здесь вы можете оставить заявку на замер или узнать подробности о его работе.\n\n"
        "Выберите действие ниже:"
    )
    
    if isinstance(event, types.Message):
        await event.answer(welcome_text, reply_markup=get_main_keyboard())
    else:
        # If the current message is media (for example after "about_master"),
        # edit_text will fail. Replace it with a new text message instead.
        if event.message.photo:
            await event.message.delete()
            await event.message.answer(welcome_text, reply_markup=get_main_keyboard())
        else:
            await event.message.edit_text(welcome_text, reply_markup=get_main_keyboard())
        await event.answer()

@dp.callback_query(F.data == "about_master")
async def about_master_handler(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    bio_text = (
        "<b>Здравствуйте! Я — Юрий.</b>\n\n"
        "Я знаю, что вы цените свое время и спокойствие. Моя задача — идеальный результат, пока вы занимаетесь своими делами.\n\n"
        "<b>Почему мне доверяют:</b>\n"
        "🤝 <b>Надежность:</b> Пунктуальность и соблюдение всех договоренностей.\n"
        "🧹 <b>Чистота:</b> Делаю уборку после работы. После меня — только чистая комната.\n"
        "💎 <b>Качество:</b> Лазерная точность и невидимые стыки.\n"
        "🛡 <b>Гарантия:</b> 6 месяцев на все работы.\n"
        "🛒 <b>Автономность:</b> Сам подберу и закуплю правильные материалы.\n\n"
        "<i>С чего начнем ваш беззаботный ремонт?</i>"
    )
    photo_path = os.path.join(os.path.dirname(__file__), 'phote_about_me.jpg')
    
    # We delete the previous message to send a new message with photo cleanly
    await callback.message.delete()
    if os.path.exists(photo_path):
        await callback.message.answer_photo(
            photo=FSInputFile(photo_path),
            caption=bio_text,
            reply_markup=get_yuri_contact_keyboard()
        )
    else:
        await callback.message.answer(
            bio_text,
            reply_markup=get_yuri_contact_keyboard()
        )
    await callback.answer()


# --- CALCULATOR FSM ---
@dp.callback_query(F.data == "calc_start")
async def calc_start(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(CalcStates.wallpaper_type)
    await callback.message.answer("Какой тип обоев планируете клеить?", reply_markup=get_wallpaper_type_keyboard())
    await callback.answer()

@dp.callback_query(StateFilter(CalcStates.wallpaper_type), F.data.startswith("type:"))
async def calc_type_selected(callback: types.CallbackQuery, state: FSMContext):
    wall_type = callback.data.split(":")[1]
    await state.update_data(wallpaper_type=wall_type)
    
    advice = "Отличный выбор! Для этого типа нужен специализированный клей, который я подберу сам."
    if wall_type == "Фотообои":
        advice = "Текстильные обои требуют ювелирной работы и контроля влажности клея. Я использую специальные добавки."

    await state.set_state(CalcStates.area_mode)
    await callback.message.answer(f"{advice}\n\nЧтобы рассчитать стоимость, мне нужно знать площадь стен. Как вам удобнее поступить?", reply_markup=get_area_mode_keyboard())
    await callback.answer()

@dp.callback_query(StateFilter(CalcStates.area_mode), F.data.startswith("area_mode:"))
async def calc_area_mode_selected(callback: types.CallbackQuery, state: FSMContext):
    mode = callback.data.split(":")[1]
    if mode == "exact":
        await state.set_state(CalcStates.area_exact)
        await callback.message.answer("Напишите точную площадь стен (в м²):", reply_markup=get_back_to_main_keyboard())
    elif mode == "house":
        await state.set_state(CalcStates.house_type)
        await callback.message.answer("Выберите тип жилья:", reply_markup=get_house_type_keyboard())
    elif mode == "floor":
        await state.set_state(CalcStates.floor_area)
        await callback.message.answer("Напишите примерную площадь пола (в м²):", reply_markup=get_back_to_main_keyboard())
    await callback.answer()

@dp.message(StateFilter(CalcStates.area_exact))
async def calc_area_exact_input(message: types.Message, state: FSMContext):
    try:
        area = float(message.text.replace(',', '.'))
        if area <= 0:
            raise ValueError
    except ValueError:
        await message.answer("Пожалуйста, введите корректное число (например: 25.5)")
        return
    await state.update_data(area=area, lazy_text="")
    await state.set_state(CalcStates.dismantle)
    await message.answer("Нужен ли демонтаж старых обоев?", reply_markup=get_dismantle_keyboard())

@dp.callback_query(StateFilter(CalcStates.house_type), F.data.startswith("house:"))
async def calc_house_type_selected(callback: types.CallbackQuery, state: FSMContext):
    h_type = callback.data.split(":")[1]
    
    bases = {"room": ("Комната", 40), "1bed": ("1-к квартира", 100), "2bed": ("2-к квартира", 140)}
    house_name, base_area = bases.get(h_type, ("Комната", 40))
    
    await state.update_data(base_area=base_area, house_name=house_name)
    await state.set_state(CalcStates.ceiling_height)
    await callback.message.answer("Выберите высоту потолков:", reply_markup=get_ceiling_keyboard())
    await callback.answer()

@dp.callback_query(StateFilter(CalcStates.ceiling_height), F.data.startswith("ceiling:"))
async def calc_ceiling_selected(callback: types.CallbackQuery, state: FSMContext):
    c_type = callback.data.split(":")[1]
    
    coeffs = {"std": ("Стандарт (2.5-2.6м)", 0.92), "new": ("Новостройка (2.7-2.8м)", 1.0), "high": ("Высокие (3м+)", 1.12)}
    ceil_name, coeff = coeffs.get(c_type, ("Стандарт (2.5-2.6м)", 0.92))
    
    data = await state.get_data()
    area = data.get('base_area', 40) * coeff
    lazy_text = f"Расчет выполнен для {data.get('house_name', 'комнаты')} с высотой потолков {ceil_name}. Это помогло сделать смету точнее на этапе оценки."
    
    await state.update_data(area=area, lazy_text=lazy_text)
    await state.set_state(CalcStates.dismantle)
    await callback.message.answer("Нужен ли демонтаж старых обоев?", reply_markup=get_dismantle_keyboard())
    await callback.answer()

@dp.message(StateFilter(CalcStates.floor_area))
async def calc_floor_area_input(message: types.Message, state: FSMContext):
    try:
        floor = float(message.text.replace(',', '.'))
        if floor <= 0:
            raise ValueError
    except ValueError:
        await message.answer("Пожалуйста, введите корректное число (например: 15)")
        return
    
    area = floor * 2.7
    lazy_text = f"Расчет стен выполнен примерно по площади пола ({floor:.1f} м²)."
    await state.update_data(area=area, lazy_text=lazy_text)
    await state.set_state(CalcStates.dismantle)
    await message.answer("Нужен ли демонтаж старых обоев?", reply_markup=get_dismantle_keyboard())

@dp.callback_query(StateFilter(CalcStates.dismantle), F.data.startswith("dismantle:"))
async def calc_dismantle_selected(callback: types.CallbackQuery, state: FSMContext):
    needs_dismantle = callback.data.split(":")[1] == "yes"
    await state.update_data(dismantle=needs_dismantle)

    await state.set_state(CalcStates.primer)
    await callback.message.answer("Нужна ли грунтовка?", reply_markup=get_primer_keyboard())
    await callback.answer()


@dp.callback_query(StateFilter(CalcStates.primer), F.data.startswith("primer:"))
async def calc_primer_selected(callback: types.CallbackQuery, state: FSMContext):
    needs_primer = callback.data.split(":")[1] == "yes"
    await state.update_data(primer=needs_primer)

    data = await state.get_data()
    w_type = data['wallpaper_type']
    area = float(data.get('area', 0))
    lazy_text = data.get('lazy_text', '')

    msg = await callback.message.answer("Идет расчет оптимальной технологии... ⏳")
    await asyncio.sleep(3)

    base_price = PRICES.get(w_type, 350)
    dismantle_price = PRICES["Демонтаж"] if data.get("dismantle") else 0
    primer_price = PRICES["Грунтовка"] if needs_primer else 0
    total_price = int(area * (base_price + dismantle_price + primer_price))

    await state.update_data(total_price=total_price)
    await state.set_state(CalcStates.waiting_for_contact)

    extra_work_parts = []
    if data.get("dismantle"):
        extra_work_parts.append("демонтаж")
    if needs_primer:
        extra_work_parts.append("грунтовка")
    extras_text = ", ".join(extra_work_parts) if extra_work_parts else "без доп. работ"

    final_text = (
        f"Для ваших обоев <b>«{w_type}»</b> на площади <b>~{area:.1f} м²</b> Юрий подберёт оптимальный набор клеевых составов.\n\n"
        f"🔧 Доп. работы: <b>{extras_text}</b>\n"
        f"💰 Примерная стоимость работ: <b>~{total_price} руб.</b>\n"
        "<i>(Финальную стоимость Юрий подтвердит после уточнения деталей)</i>\n\n"
    )
    if lazy_text:
        final_text += f"<i>{lazy_text} Юрий подтвердит итоговую цифру при звонке.</i>\n\n"
    final_text += "Чтобы Юрий подтвердил окончательную цену и проверил свободные даты в своем графике, нажмите кнопку ниже."
    
    await msg.delete()
    await callback.message.answer(final_text, reply_markup=get_contact_keyboard())
    await callback.answer()

@dp.message(StateFilter(CalcStates.waiting_for_contact), F.contact)
@dp.message(StateFilter(CalcStates.waiting_for_contact), F.text)
async def calc_contact_received(message: types.Message, state: FSMContext):
    phone = "Not provided"
    if message.contact:
        phone = message.contact.phone_number
    elif message.text:
       phone = message.text
       
    data = await state.get_data()
    
    # Send Thanks to user
    await message.answer(
        "✅ Спасибо! Ваша заявка принята. Юрий свяжется с вами в ближайшее время.", 
        reply_markup=ReplyKeyboardRemove()
    )
    # Channel link and return to menu
    await message.answer(
        "Пока Юрий готовит ответ, вы можете заглянуть в его канал с секретами ремонта:",
        reply_markup=get_faq_return_keyboard()
    )
    
    # Notification to Admin
    dismantle_str = "Да" if data.get('dismantle') else "Нет"
    primer_str = "Да" if data.get('primer') else "Нет"
    area_formatted = f"{float(data.get('area', 0)):.1f}"
    admin_text = (
        f"🔥 <b>НОВАЯ ЗАЯВКА (Телеграм)!</b>\n\n"
        f"Имя: {message.from_user.full_name}\n"
        f"Тел: {phone}\n"
        f"Заказ: {data.get('wallpaper_type')}, {area_formatted} м², Демонтаж: {dismantle_str}, Грунтовка: {primer_str}\n"
        f"Расчет бота: {data.get('total_price')} руб."
    )
    try:
        await bot.send_message(chat_id=ADMIN_ID, text=admin_text)
    except Exception as e:
        logging.error(f"Failed to notify admin: {e}")
        
    await state.clear()


# --- FAQ SECTION ---
@dp.callback_query(F.data == "faq_menu")
async def faq_menu_handler(callback: types.CallbackQuery):
    if callback.message.photo:
        await callback.message.delete()
        await callback.message.answer("Вы задаете отличные вопросы! Выберите тему ниже:", reply_markup=get_faq_keyboard())
    else:
        await callback.message.edit_text("Вы задаете отличные вопросы! Выберите тему ниже:", reply_markup=get_faq_keyboard())
    await callback.answer()

@dp.callback_query(F.data.startswith("faq_"))
async def faq_item_handler(callback: types.CallbackQuery):
    topic = callback.data
    answer_text = ""
    
    if topic == "faq_time":
        answer_text = "<b>Сколько времени занимает одна комната?</b>\n\nСтандартная комната клеится за 1 день. Я не пропадаю с объекта."
    elif topic == "faq_warranty":
        answer_text = "<b>Что делать, если через месяц разойдется стык?</b>\n\nЯ работаю официально как самозанятый и даю гарантию 6 месяцев. Если что-то случится не по вашей вине — приеду и исправлю бесплатно."
    elif topic == "faq_materials":
        answer_text = "<b>Нужно ли мне покупать клей и пленку?</b>\n\nЯ рекомендую конкретные составы под ваши обои или могу закупить и привезти проверенный клей сам."
    elif topic == "faq_prep":
        answer_text = "<b>Как подготовить комнату к вашему приходу?</b>\n\nОсвободите стены, отодвиньте мебель на 1.5 метра. Подробную инструкцию пришлю вам сразу после записи."
    else:
        return

    await callback.message.edit_text(answer_text, reply_markup=get_faq_answer_keyboard())
    await callback.answer()


@dp.callback_query(F.data == "portfolio_menu")
async def portfolio_menu_handler(callback: types.CallbackQuery):
    if callback.message.photo:
        await callback.message.delete()
        await callback.message.answer("Какие примеры работ вам интересны?", reply_markup=get_portfolio_keyboard())
    else:
        await callback.message.edit_text("Какие примеры работ вам интересны?", reply_markup=get_portfolio_keyboard())
    await callback.answer()


@dp.callback_query(F.data.startswith("portfolio_") & (F.data != "portfolio_menu"))
async def portfolio_category_handler(callback: types.CallbackQuery):
    cat = callback.data
    await callback.message.delete()
    
    # Определяем путь к текущей папке, где лежит main.py
    current_dir = os.path.dirname(__file__)

    if cat == "portfolio_details":
        # Используем ПЕРВОЕ фото (проверь, что буква P большая, как на скрине!)
        photo_path = os.path.join(current_dir, "photo_2_1_reality.jpg")
        await callback.message.answer_photo(
            photo=FSInputFile(photo_path),
            caption="🔍 <b>Стыки и детали</b>\n\nЛазерная точность на углах. Юрий делает так, чтобы швы исчезали.",
            reply_markup=get_calc_return_keyboard()
        )

    elif cat == "portfolio_premium":
        # Используем ВТОРОЕ фото
        photo_path = os.path.join(current_dir, "Photo_1_reality.jpg")
        await callback.message.answer_photo(
            photo=FSInputFile(photo_path),
            caption="💎 <b>Фотообои</b>\n\nРаботаем с текстилем и фресками. Бережное отношение к каждому рулону.",
            reply_markup=get_calc_return_keyboard()
        )

    elif cat == "portfolio_general":
        from aiogram.types import InputMediaPhoto
        
        # Собираем альбом из 3-х и 4-х фото (как на скрине)
        media = [
            InputMediaPhoto(media=FSInputFile(os.path.join(current_dir, "photo_3_reality.jpg")), 
                            caption="🏠 <b>Общий вид</b>\nЧистота и ровные стены — стандарт работы Юрия."),
            InputMediaPhoto(media=FSInputFile(os.path.join(current_dir, "photo_4_reality.jpg")))
        ]
        
        await callback.message.answer_media_group(media=media)
        await callback.message.answer("Хотите такой же результат? Рассчитайте стоимость:", 
                                      reply_markup=get_calc_return_keyboard())

    await callback.answer()


# --- FASTAPI LOGIC ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start bot polling in background
    polling_task = asyncio.create_task(dp.start_polling(bot))
    try:
        yield
    finally:
        polling_task.cancel()
        await bot.session.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/leads")
async def receive_lead(lead: Lead):
    """
    Endpoint for the React frontend to push leads to Telegram
    """
    admin_text = (
        f"🌐 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n"
        f"👤 Имя: {lead.name}\n"
        f"📞 Телефон: {lead.phone}\n"
    )
    if lead.message:
        admin_text += f"💬 Комментарий: {lead.message}\n"

    try:
        await bot.send_message(chat_id=ADMIN_ID, text=admin_text)
        return {"status": "success", "message": "Lead forwarded to Telegram"}
    except Exception as e:
        logging.error(f"Failed to send lead to Telegram: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    # Run the combined app
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

