var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope','$log', function($scope, $log) {
    
    $scope.name = 'Kraig';

    $scope.stats = {

        name: 'Kraig',
        health: 100,
        hunger: 0,
        thirst: 0,
        exhaustion: 0,
        shelter: 'None'

    };

    $scope.inventory = {

        wood: 0,
        stone: 0,
        fibers: 0,

        ax: 0,
        club: 0,
        spear: 0,
        knife: 0,
        campfire: 0,
        raincatcher: 0,

        rawMeat: 0,
        cookedMeat: 0,
        insects: 0,
        leaves: 0,
        water: 0,

        feathers: 0,
        hide: 0,
        leather: 0

    };

    $scope.action = {

        forage: function () {

            insectsQty = $scope.rand(2, 0);
            leavesQty = $scope.rand(2, 0);
            waterQty = $scope.rand(2, 0);

            if ($scope.inventory.raincatcher > 0) {
                waterQty += 1;
            }

            $scope.inventory.insects += insectsQty;
            $scope.inventory.leaves += leavesQty;
            $scope.inventory.water += waterQty;
            $scope.mutate.resources(1, 1, 2);
            text = 'You forage ' + insectsQty + ' insects, ' + leavesQty + ' edible leaves, and ' + waterQty + ' water';
            $log.log(text);
            $scope.journal.innerHTML = text;

        },

        gather: function ( type ) {

            qty = $scope.rand(4,0);

            if (qty === 0) {
                text = 'You fail to gather any ' + type;
            } else {
                $scope.inventory[ type ] += qty;
                text = 'You gather ' + qty + ' ' + type;
            }
            $scope.mutate.resources(2, 2, 4);
            $log.log(text);
            $scope.journal.innerHTML = text;

        },

        ingest: function ( consumableItem ) {

            if ( consumableItem === 'water') {
                consumableType = 'drink';
                foodDemandWord = 'thirst';
            } else {
                consumableType = 'food';
                foodDemandWord = 'hunger';
            }

            if ($scope.stats[ foodDemandWord ] <= 0) {

                text = "You don't need this. Better save it.";

            } else {

                $scope.inventory[ consumableItem ] -= 1;

                if ($scope.stats[ foodDemandWord ] < $scope.edible[ consumableItem ].recovery) {
                    $scope.stats[ foodDemandWord ] = 0;
                } else {
                    $scope.stats[ foodDemandWord ] -= $scope.edible[ consumableItem ].recovery;
                }
                text = 'You consume the ' + consumableItem;

            }

            $log.log(text);
            $scope.journal.innerHTML = text;

        },

        cook: {

            meat: function() {

                $scope.inventory.rawMeat -= 1;
                $scope.inventory.cookedMeat += 1;
                text = 'You cook some meat';

                $log.log(text);
                $scope.journal.innerHTML = text;


            }

        },

        sleep: function() {

            if ($scope.stats.exhaustion <= 0) {

                text = "You're not tired. You should get to work.";

            } else {

                $scope.stats.hunger += 6;
                $scope.stats.thirst += 6;

                switch($scope.stats.shelter) {

                    case 'Lean To':
                        amount = 40;
                        break;
                    case 'Hut':
                        amount = 60;
                        break;
                    case 'Shack':
                        amount = 80;
                        break;
                    case 'Cabin':
                        amount = 100;
                        break;
                    default:
                        amount = 20;

                }

                if ($scope.stats.exhaustion - amount < 0 ){

                    $scope.stats.exhaustion = 0;

                } else {

                    $scope.stats.exhaustion -= amount;

                }

                text = 'You sleep';

            }

            $log.log(text);
            $scope.journal.innerHTML = text;

        },

        hunt: function() {

            rnd = $scope.rand(4, 1);

            $scope.mutate.resources(2, 2, 5);

            if (rnd === 1) {

                text = 'You don\'t find anything.';

            } else {

                randAnimal = $scope.rand($scope.animals.length -1, 0);
                $log.log(randAnimal);
                animal = $scope.animals[randAnimal];
                text = 'You find a ' + animal.name;

                if ($scope.rand(2, 1) === 1) {

                    text += ' but it got away.';

                } else {

                    text += ' and you take it down! ';
                    meat = $scope.rand(animal.maxMeat, 0);
                    $scope.inventory.rawMeat += meat;

                    if ($scope.inventory.knife) {

                        harvest = $scope.rand(animal.maxHarvestable, 0);
                        harvest += 2;

                    } else {

                        harvest = $scope.rand(animal.maxHarvestable, 0);

                    }

                    if (harvest === 0) {

                        text += 'You fail to harvest anything.';

                    } else {

                        text += 'You harvest ' + harvest + ' ' + animal.harvestable;
                        $scope.inventory[animal.harvestable] += harvest;

                    }
                }

            }

            $log.log(text);
            $scope.journal.innerHTML = text;

        },

        build: {

            shelter: function( type ) {

                $scope.mutate.resources(10, 10, 10);
                $scope.inventory.wood -= $scope.crafted.shelter[ type ].wood;
                $scope.inventory.stone -= $scope.crafted.shelter[ type ].stone;
                $scope.inventory.fibers -= $scope.crafted.shelter[ type ].fibers;
                $scope.stats.shelter = $scope.crafted.shelter[ type ].name;
                text = 'You built a ' + $scope.crafted.shelter[ type ].name;
                $log.log(text);
                $scope.journal.innerHTML = text;

            },

            tool: function ( type ) {

                $scope.mutate.resources(2, 2, 3);
                $scope.inventory.wood -= $scope.crafted.tool[ type ].wood;
                $scope.inventory.stone -= $scope.crafted.tool[ type ].stone;
                $scope.inventory.fibers -= $scope.crafted.tool[ type ].fibers;
                text = 'You built a' + $scope.crafted.tool[ type ].name;
                $scope.inventory[ type ] += 1;
                $log.log(text);
                $scope.journal.innerHTML = text;

            }

        }

    };

    $scope.crafted = {

        shelter: {

            leanto: {

                name: 'Lean To',
                wood: 50,
                stone: 10,
                fibers: 10

            },
            hut: {

                name: 'Hut',
                wood: 150,
                stone: 30,
                fibers: 30

            },
            shack: {

                name: 'Shack',
                wood: 500,
                stone: 90,
                fibers: 90

            },
            cabin: {

                name: 'Cabin',
                wood: 1500,
                stone: 250,
                fibers: 250

            }

        },

        tool: {

            ax: {

                name: 'n Ax',
                wood: 1,
                stone: 1,
                fibers: 5

            },
            club: {

                name: ' Club',
                wood: 5,
                stone: 0,
                fibers: 0

            },
            spear: {

                name: ' Spear',
                wood: 1,
                stone: 1,
                fibers: 5

            },
            knife: {

                name: ' Knife',
                wood: 1,
                stone: 1,
                fibers: 5

            },
            campfire: {

                name: ' Campfire',
                wood: 10,
                stone: 10,
                fibers: 0

            },
            raincatcher: {

                name: ' Rain Catcher',
                wood: 5,
                stone: 3,
                fibers: 10

            }

        }

    };

    $scope.edible = {

        insects: {

            name: 'Insects',
            recovery: 1,
            safe: true

        },
        leaves: {

            name: 'Leaves',
            recovery: 1,
            safe: true

        },
        rawMeat: {

            name: 'Raw Meat',
            recovery: 1,
            safe: false

        },
        cookedMeat: {

            name: 'Cooked Meat',
            recovery: 5,
            safe: true

        },
        water: {

            name: 'Water',
            recovery: 5,
            safe: true

        },
        sick: function( maxChance ) {

            maxChance = maxChance || 5;

            if ($scope.rand(maxChance, 0)) {

                text = 'You get sick!';

                if ($scope.stats.health -= 10 <= 0) {
                    alert('You became too sick and died.');
                } else {
                    $scope.stats.health -= 10;
                }

            }

        }

    };

    $scope.animals = [

        {
            name: 'Bird',
            maxMeat: 1,
            harvestable: 'feathers',
            maxHarvestable: 5,
            defense: 10
        },
        {
            name: 'Rabbit',
            maxMeat: 2,
            harvestable: 'hide',
            maxHarvestable: 1,
            defense: 10
        },
        {
            name: 'Deer',
            maxMeat: 1,
            harvestable: 'hide',
            maxHarvestable: 7,
            defense: 8
        },
        {
            name: 'Boar',
            maxMeat: 1,
            harvestable: 'hide',
            maxHarvestable: 5,
            attack: 5,
            defense: 5
        },
        {
            name: 'Wolf',
            maxMeat: 1,
            harvestable: 'hide',
            maxHarvestable: 10,
            attack: 7,
            defense: 7
        },
        {
            name: 'Bear',
            maxMeat: 1,
            harvestable: 'hide',
            maxHarvestable: 15,
            attack: 10,
            defense: 12
        }

    ];

    $scope.mutate = {
        resources: function(hunger, thirst, exhaustion) {

            $scope.stats.hunger += hunger || 0;
            $scope.stats.thirst += thirst || 0;
            $scope.stats.exhaustion += exhaustion || 0;

        }
    };

    $scope.rand = function(max, min) {

        return Math.floor(Math.random()*(max-min+1)+min);

    };

    $scope.journal = document.getElementById('output');
    
}]);