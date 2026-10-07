type PropertyListingType = 'SINGLE' | 'MTL' | 'MTL_CHILD';

type PropertyType =
    | 'APARTMENT'
    | 'HOUSE'
    | 'LOFT'
    | 'BOAT'
    | 'CAMPER/RV'
    | 'CONDOMINIUM'
    | 'BED & BREAKFAST'
    | 'CABIN'
    | 'TOWNHOUSE'
    | 'HUT'
    | 'DORM'
    | 'TREEHOUSE'
    | 'YURT'
    | 'CASTLE'
    | 'STUDIO'
    | 'BUNGALOW'
    | 'CHALET'
    | 'VILLA'
    | 'TENT';

type PropertyRoomType = 'Private room' | 'Entire home/apt' | 'Shared room';

type PropertyCurrency =
    | 'USD'
    | 'EUR'
    | 'AUD'
    | 'CAD'
    | 'JPY'
    | 'ILS'
    | 'GBP'
    | 'HKD'
    | 'NOK'
    | 'CZK'
    | 'BRL'
    | 'THB'
    | 'ZAR'
    | 'MYR'
    | 'KRW'
    | 'IDR'
    | 'PHP'
    | 'INR'
    | 'NZD'
    | 'TWD'
    | 'PLN'
    | 'SGD'
    | 'TRY'
    | 'SEK'
    | 'VND'
    | 'ARS'
    | 'CNY'
    | 'DKK'
    | 'MXN';

type PropertyTaxType =
    | 'LOCAL_TAX'
    | 'CITY_TAX'
    | 'VAT'
    | 'GOODS_AND_SERVICES_TAX'
    | 'TOURISM_TAX'
    | 'OTHER';

type PropertyAmenity =
    | 'ACCESSIBLE_HEIGHT_BED'
    | 'ACCESSIBLE_HEIGHT_TOILET'
    | 'AIR_CONDITIONING'
    | 'BABYSITTER_RECOMMENDATIONS'
    | 'BABY_BATH'
    | 'BABY_MONITOR'
    | 'BATHTUB'
    | 'BBQ_GRILL'
    | 'BEACH_ESSENTIALS'
    | 'BED_LINENS'
    | 'BREAKFAST'
    | 'CABLE_TV'
    | 'CARBON_MONOXIDE_DETECTOR'
    | 'CHANGING_TABLE'
    | 'CHILDREN_BOOKS_AND_TOYS'
    | 'CHILDREN_DINNERWARE'
    | 'CLEANING_BEFORE_CHECKOUT'
    | 'COFFEE_MAKER'
    | 'COOKING_BASICS'
    | 'DISABLED_PARKING_SPOT'
    | 'DISHES_AND_SILVERWARE'
    | 'DISHWASHER'
    | 'DOGS'
    | 'DOORMAN'
    | 'DRYER'
    | 'ELEVATOR_IN_BUILDING'
    | 'ESSENTIALS'
    | 'EV_CHARGER'
    | 'EXTRA_PILLOWS_AND_BLANKETS'
    | 'FIREPLACE_GUARDS'
    | 'FIRE_EXTINGUISHER'
    | 'FIRM_MATTRESS'
    | 'FIRST_AID_KIT'
    | 'FLAT_SMOOTH_PATHWAY_TO_FRONT_DOOR'
    | 'FREE_PARKING_ON_PREMISES'
    | 'GAME_CONSOLE'
    | 'GARDEN_OR_BACKYARD'
    | 'GRAB_RAILS_FOR_SHOWER_AND_TOILET'
    | 'GYM'
    | 'HAIR_DRYER'
    | 'HANGERS'
    | 'HEATING'
    | 'HIGH_CHAIR'
    | 'HOT_TUB'
    | 'HOT_WATER'
    | 'INDOOR_FIREPLACE'
    | 'INTERNET'
    | 'IRON'
    | 'KITCHEN'
    | 'LAPTOP_FRIENDLY_WORKSPACE'
    | 'LONG_TERM_STAYS_ALLOWED'
    | 'LUGGAGE_DROPOFF_ALLOWED'
    | 'MICROWAVE'
    | 'OTHER_PET'
    | 'OUTLET_COVERS'
    | 'OVEN'
    | 'PACK_N_PLAY_TRAVEL_CRIB'
    | 'PATH_TO_ENTRANCE_LIT_AT_NIGHT'
    | 'PATIO_OR_BALCONY'
    | 'PETS_ALLOWED'
    | 'PETS_LIVE_ON_THIS_PROPERTY'
    | 'POCKET_WIFI'
    | 'PRIVATE_ENTRANCE'
    | 'REFRIGERATOR'
    | 'ROLL_IN_SHOWER_WITH_SHOWER_BENCH_OR_CHAIR'
    | 'ROOM_DARKENING_SHADES'
    | 'SHAMPOO'
    | 'SINGLE_LEVEL_HOME'
    | 'SMOKE_DETECTOR'
    | 'SMOKING_ALLOWED'
    | 'STAIR_GATES'
    | 'STEP_FREE_ACCESS'
    | 'STOVE'
    | 'SUITABLE_FOR_INFANTS'
    | 'SUITABLE_FOR_CHILDREN'
    | 'TUB_WITH_SHOWER_BENCH'
    | 'TV'
    | 'WASHER'
    | 'WIDE_CLEARANCE_TO_BED'
    | 'WIDE_CLEARANCE_TO_SHOWER_AND_TOILET'
    | 'WIDE_DOORWAY'
    | 'WIDE_HALLWAY_CLEARANCE'
    | 'WINDOW_GUARDS'
    | 'WIRELESS_INTERNET';

type PropertyBedType =
    | 'KING_BED'
    | 'QUEEN_BED'
    | 'DOUBLE_BED'
    | 'SINGLE_BED'
    | 'SOFA_BED'
    | 'AIR_MATTRESS'
    | 'BUNK_BED'
    | 'FLOOR_MATTRESS'
    | 'WATER_BED'
    | 'TODDLER_BED'
    | 'CRIB';

type PropertyAddress = {
    city?: string;
    country?: string;
    full?: string;
    lat?: number;
    lng?: number;
    state?: string;
    street?: string;
    neighborhood?: string;
};

type PropertyPicture = {
    _id?: string;
    original?: string;
    large?: string;
    regular?: string;
    thumbnail?: string;
    caption?: string;
};

type PropertyPrices = {
    basePrice?: number;
    currency?: PropertyCurrency;
    monthlyPriceFactor?: number;
    weeklyPriceFactor?: number;
    extraPersonFee?: number;
    cleaningFee?: number;
    petFee?: number;
};

type PropertyGuestControls = {
    allowsChildren?: boolean;
    allowsInfants?: boolean;
    allowsPets?: boolean;
    allowsSmoking?: boolean;
    allowsEvents?: boolean;
};

type PropertyPublicDescription = {
    summary?: string;
    space?: string;
    access?: string;
    notes?: string;
    transit?: string;
    interactionWithGuests?: string;
    neighborhood?: string;
    guestControls?: PropertyGuestControls;
    houseRules?: string;
};

type PropertyTerms = {
    minNight?: number;
    minNights?: number;
    maxNights?: number;
    cancellation?: string;
};

type PropertyTax = {
    _id?: string;
    amount?: number;
    appliedToAllFees?: boolean;
    appliedOnFees?: string[];
    name?: string | null;
    quantifier?: string;
    type?: PropertyTaxType;
    units?: string;
};

type PropertySeasonalMinNights = {
    from?: string;
    to?: string;
    minNights?: number;
};

type PropertyRentalPeriod = {
    from?: string;
    to?: string;
};

type PropertyCalendarRules = {
    defaultAvailability?: 'AVAILABLE' | 'BLOCKED';
    seasonalMinNights?: PropertySeasonalMinNights[];
    rentalPeriods?: PropertyRentalPeriod[];
    advanceNotice?: {
        defaultSettings?: {
            hours?: number;
            allowRequestToBook?: boolean;
        };
    };
    bookingWindow?: {
        defaultSettings?: {
            days?: number;
        };
    };
};

type PropertyReviews = {
    avg?: number;
    total?: number;
};

type PropertyPaymentSchedule = {
    reservationEvent?: string;
    timeRelation?: {
        relation?: string;
        unit?: string;
        amount?: number;
    };
};

type PropertyPaymentAuthorization = {
    inUse?: boolean;
    scheduleTo?: PropertyPaymentSchedule;
    chargeType?: string;
    amount?: number;
};

export type Property = {
    _id?: string;
    accountId?: string;
    type?: PropertyListingType;
    propertyType?: PropertyType;
    roomType?: PropertyRoomType;
    title?: string;
    nickname?: string;
    accomodates?: number;
    accommodates?: number;
    address?: PropertyAddress;
    timezone?: string;
    amenities?: Array<PropertyAmenity>;
    bathrooms?: number;
    bedrooms?: number;
    beds?: number;
    bedType?: string;
    defaultCheckInTime?: string;
    defaultCheckOutTime?: string;
    pictures?: PropertyPicture[];
    picture?: PropertyPicture;
    prices?: PropertyPrices;
    publicDescription?: PropertyPublicDescription;
    terms?: PropertyTerms;
    accountTaxes?: PropertyTax[];
    taxes?: PropertyTax[];
    calendarRules?: PropertyCalendarRules;
    reviews?: PropertyReviews;
    tags?: string[];
    bedArrangements?: {
        unitTypeId?: string;
        accountId?: string;
        bedrooms?: Array<{
            roomNumber?: number;
            name?: string;
            type?: string;
            beds?: Partial<Record<PropertyBedType, number>>;
        }>;
        bedroomsAllowed?: boolean;
        isDefaultBedArrangement?: boolean;
        bathrooms?: {
            BEDROOM?: number;
            PRIVATE?: number;
        };
        deleted?: boolean;
        deletedAt?: string;
    };
    unitTypeHouseRules?: {
        unitTypeId?: string;
        houseRules?: {
            additionalRules?: string;
            petsAllowed?: {
                enabled?: boolean;
                chargeType?: string;
            };
            quietBetween?: {
                enabled?: boolean;
                hours?: {
                    start?: string;
                    end?: string;
                };
            };
            smokingAllowed?: {
                enabled?: boolean;
            };
            suitableForEvents?: {
                enabled?: boolean;
            };
            childrenRules?: {
                suitableForChildren?: boolean;
                suitableForInfants?: boolean;
                reason?: string;
            };
        };
        deleted?: boolean;
        deletedAt?: string;
    };
    autoPayments?: {
        policy?: Array<{
            scheduleTo?: PropertyPaymentSchedule;
            chargeAuthorizationHold?: PropertyPaymentAuthorization;
            releaseAuthorizationHold?: PropertyPaymentAuthorization;
            chargeType?: string;
            amount?: number;
            useGuestCard?: boolean;
            isAuthorizationHold?: boolean;
            notifyIfHoldFails?: boolean;
            whenContext?: string;
        }>;
    };
};

export type PropertyCard = {
    _id?: string;
    type?: PropertyListingType | null;
    nickname?: string | null;
    propertyType?: PropertyType | null;
    title?: string | null;
    accommodates?: number | null;
    picture?: PropertyPicture | null;
    prices?: PropertyPrices | null;
    address?: PropertyAddress | null;
    bathrooms?: number | null;
    beds?: number | null;
    reviews?: PropertyReviews;
};

export type Pagination = {
    total: number;
    cursor: {
        next: string;
    };
};

export type ListingResponse = {
    results: PropertyCard[];
    pagination: Pagination;
};
